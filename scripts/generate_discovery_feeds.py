#!/usr/bin/env python3
"""Génère sitemap.xml et rss.xml sans dépendance à un service Google.

Le sitemap recense les pages HTML publiques du dépôt.
Le flux RSS recense les publications validées archivées dans content/published/.
"""

from __future__ import annotations

import email.utils
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://patrickbillyofficiel.github.io"
PUBLISHED = ROOT / "content" / "published"


def parse_front_matter(text: str) -> tuple[dict[str, str], str]:
    if not text.startswith("---\n"):
        return {}, text
    try:
        _, raw_meta, body = text.split("---\n", 2)
    except ValueError:
        return {}, text
    meta: dict[str, str] = {}
    for line in raw_meta.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        meta[key.strip()] = value.strip().strip('"')
    return meta, body.strip()


def slugify(text: str) -> str:
    repl = str.maketrans("àâäéèêëîïôöùûüç", "aaaeeeeiioouuuc")
    text = text.lower().translate(repl)
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text[:90] or "publication"


def build_sitemap() -> str:
    urls: list[str] = []
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT)
        if any(part.startswith(".") for part in rel.parts):
            continue
        url = f"{BASE_URL}/{rel.as_posix()}"
        if rel.as_posix() == "index.html":
            url = f"{BASE_URL}/"
        urls.append(url)

    entries = "\n".join(
        f"  <url><loc>{html.escape(url)}</loc></url>" for url in urls
    )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{entries}\n"
        '</urlset>\n'
    )


def description_from_body(body: str) -> str:
    plain = re.sub(r"[#>*`_\-]", " ", body)
    plain = re.sub(r"\s+", " ", plain).strip()
    return plain[:220] or "Publication Élan pour Tous sur l’IA inclusive et l’accessibilité."


def build_rss() -> str:
    items: list[str] = []
    if PUBLISHED.exists():
        posts = []
        for path in PUBLISHED.glob("*.md"):
            meta, body = parse_front_matter(path.read_text(encoding="utf-8"))
            title = meta.get("title", path.stem)
            date = meta.get("date", "")
            posts.append((date, title, body))
        posts.sort(reverse=True)

        for date, title, body in posts[:50]:
            slug = slugify(title)
            link = f"{BASE_URL}/pages/publications/{slug}.html"
            pub_date = ""
            if re.fullmatch(r"\d{4}-\d{2}-\d{2}", date):
                year, month, day = map(int, date.split("-"))
                pub_date = email.utils.formatdate(
                    __import__("datetime").datetime(year, month, day, 12, 0).timestamp(),
                    usegmt=True,
                )
            items.append(
                "    <item>\n"
                f"      <title>{html.escape(title)}</title>\n"
                f"      <link>{html.escape(link)}</link>\n"
                f"      <guid>{html.escape(link)}</guid>\n"
                + (f"      <pubDate>{pub_date}</pubDate>\n" if pub_date else "")
                + f"      <description>{html.escape(description_from_body(body))}</description>\n"
                "    </item>"
            )

    item_xml = "\n".join(items)
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Patrick Billy — Élan pour Tous — Work-Test-Démo</title>
    <link>{BASE_URL}/</link>
    <description>Publications sur l’IA inclusive, l’accessibilité, la formation et le recrutement par les compétences.</description>
    <language>fr</language>
{item_xml}
  </channel>
</rss>
'''


def main() -> None:
    (ROOT / "sitemap.xml").write_text(build_sitemap(), encoding="utf-8")
    (ROOT / "rss.xml").write_text(build_rss(), encoding="utf-8")
    print("sitemap.xml et rss.xml générés")


if __name__ == "__main__":
    main()
