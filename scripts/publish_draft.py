#!/usr/bin/env python3
"""Publie un brouillon validé sous forme de page HTML statique accessible.

Le script n'accepte que des fichiers présents dans content/drafts/ et ne publie
rien vers une plateforme externe.
"""

from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DRAFTS = (ROOT / "content" / "drafts").resolve()
PUBLICATIONS = ROOT / "pages" / "publications"


def parse_front_matter(text: str) -> tuple[dict[str, str], str]:
    if not text.startswith("---\n"):
        raise ValueError("Front matter manquant.")
    _, raw_meta, body = text.split("---\n", 2)
    meta: dict[str, str] = {}
    for line in raw_meta.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        meta[key.strip()] = value.strip().strip('"')
    return meta, body.strip()


def inline_md(text: str) -> str:
    safe = html.escape(text)
    safe = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", safe)
    safe = re.sub(r"`(.+?)`", r"<code>\1</code>", safe)
    return safe


def markdown_to_html(body: str) -> str:
    out: list[str] = []
    in_list = False
    for raw in body.splitlines():
        line = raw.rstrip()
        if not line:
            if in_list:
                out.append("</ul>")
                in_list = False
            continue
        if line.startswith("# "):
            continue
        if line.startswith("## "):
            if in_list:
                out.append("</ul>")
                in_list = False
            out.append(f"<h2>{inline_md(line[3:])}</h2>")
        elif line.startswith("- "):
            if not in_list:
                out.append("<ul>")
                in_list = True
            out.append(f"<li>{inline_md(line[2:])}</li>")
        elif line.startswith("> "):
            if in_list:
                out.append("</ul>")
                in_list = False
            out.append(f'<p class="inner-note">{inline_md(line[2:])}</p>')
        else:
            if in_list:
                out.append("</ul>")
                in_list = False
            out.append(f"<p>{inline_md(line.replace('  ', ' '))}</p>")
    if in_list:
        out.append("</ul>")
    return "\n".join(out)


def slugify(text: str) -> str:
    repl = str.maketrans("àâäéèêëîïôöùûüç", "aaaeeeeiioouuuc")
    text = text.lower().translate(repl)
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text[:90] or "publication"


def build_page(meta: dict[str, str], body_html: str) -> tuple[str, str]:
    title = meta.get("title", "Publication Élan pour Tous")
    date = meta.get("date", "")
    audience = meta.get("audience", "general")
    slug = slugify(title)
    description = (
        "Patrick Billy, Élan pour Tous et Work-Test-Démo : IA inclusive, "
        "accessibilité, formation et recrutement par les compétences."
    )
    schema = json.dumps({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "datePublished": date,
        "author": {"@type": "Person", "name": "Patrick Billy"},
        "publisher": {"@type": "Organization", "name": "Élan pour Tous"},
        "about": ["IA inclusive", "accessibilité", "handicap", "formation", "Work-Test-Démo"],
    }, ensure_ascii=False)

    page = f'''<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>{html.escape(title)} – Patrick Billy · Élan pour Tous</title>
  <meta name="description" content="{html.escape(description)}" />
  <meta name="author" content="Patrick Billy" />
  <meta name="robots" content="index,follow" />
  <link rel="stylesheet" href="../../assets/css/base.css" />
  <link rel="stylesheet" href="../../assets/css/layout.css" />
  <link rel="stylesheet" href="../../assets/css/components.css" />
  <link rel="stylesheet" href="../../assets/css/inner-pages.css" />
  <script type="application/ld+json">{schema}</script>
</head>
<body class="inner-page">
  <a class="skip-link" href="#main">Aller au contenu principal</a>
  <header class="site-header" role="banner">
    <nav class="inner-nav" aria-label="Navigation principale">
      <a class="inner-brand" href="../../index.html"><strong>Élan pour Tous</strong><span>IA inclusive · Patrick Billy</span></a>
      <ul class="inner-menu"><li><a href="../../index.html">Accueil</a></li><li><a href="../entreprises-organismes.html">Entreprises</a></li><li><a href="../formations.html">Formations</a></li><li><a href="../blog.html">Ressources</a></li><li><a href="../../portfolio/contact.html">Contact</a></li></ul>
    </nav>
  </header>
  <main id="main" tabindex="-1">
    <section class="inner-hero"><div class="inner-wrap"><p class="inner-eyebrow">Publication validée · {html.escape(audience)}</p><h1>{html.escape(title)}</h1><p class="inner-lead">Patrick Billy · Élan pour Tous · Work-Test-Démo</p></div></section>
    <section class="inner-section"><article class="inner-wrap inner-card">{body_html}</article></section>
  </main>
  <footer class="site-footer" role="contentinfo"><div class="inner-wrap inner-footer"><p>© Patrick Billy — Élan pour Tous</p><p><a href="../accessibilite.html">Accessibilité</a> · <a href="../mentions-legales.html">Mentions légales</a></p></div></footer>
  <script src="../../assets/js/accessibility-options.js" defer></script>
</body>
</html>'''
    return slug, page


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--draft", required=True, help="Chemin sous content/drafts/")
    args = parser.parse_args()

    draft = (ROOT / args.draft).resolve()
    if draft.parent != DRAFTS or draft.suffix.lower() != ".md":
        raise SystemExit("Publication refusée : le fichier doit être un .md directement dans content/drafts/.")
    if not draft.exists():
        raise SystemExit(f"Brouillon introuvable : {args.draft}")

    meta, body = parse_front_matter(draft.read_text(encoding="utf-8"))
    if meta.get("status") != "draft":
        raise SystemExit("Publication refusée : le statut attendu est draft.")

    slug, page = build_page(meta, markdown_to_html(body))
    PUBLICATIONS.mkdir(parents=True, exist_ok=True)
    output = PUBLICATIONS / f"{slug}.html"
    if output.exists():
        raise SystemExit(f"Publication déjà existante : {output.relative_to(ROOT)}")
    output.write_text(page, encoding="utf-8")

    published_dir = ROOT / "content" / "published"
    published_dir.mkdir(parents=True, exist_ok=True)
    archived = published_dir / draft.name
    archived.write_text(draft.read_text(encoding="utf-8").replace("status: draft", "status: published", 1), encoding="utf-8")
    draft.unlink()
    print(output.relative_to(ROOT))


if __name__ == "__main__":
    main()
