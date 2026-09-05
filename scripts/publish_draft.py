#!/usr/bin/env python3
"""Publie un brouillon validé sous forme de page HTML statique accessible."""
from __future__ import annotations
import argparse, html, json, re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; DRAFTS=(ROOT/'content'/'drafts').resolve(); PUBLICATIONS=ROOT/'pages'/'publications'; BLOG=ROOT/'pages'/'blog.html'
START_MARKER='<!-- AUTO-PUBLICATIONS-START -->'; END_MARKER='<!-- AUTO-PUBLICATIONS-END -->'
def parse_front_matter(text):
    if not text.startswith('---\n'): raise ValueError('Front matter manquant.')
    _,raw,body=text.split('---\n',2); meta={}
    for line in raw.splitlines():
        if ':' in line:
            k,v=line.split(':',1); meta[k.strip()]=v.strip().strip('"')
    return meta,body.strip()
def inline_md(text):
    safe=html.escape(text); safe=re.sub(r'\*\*(.+?)\*\*',r'<strong>\1</strong>',safe); return re.sub(r'`(.+?)`',r'<code>\1</code>',safe)
def markdown_to_html(body):
    out=[]; in_list=False
    for raw in body.splitlines():
        line=raw.rstrip()
        if not line:
            if in_list: out.append('</ul>'); in_list=False
            continue
        if line.startswith('# '): continue
        if line.startswith('## '):
            if in_list: out.append('</ul>'); in_list=False
            out.append(f'<h2>{inline_md(line[3:])}</h2>')
        elif line.startswith('- '):
            if not in_list: out.append('<ul>'); in_list=True
            out.append(f'<li>{inline_md(line[2:])}</li>')
        else:
            if in_list: out.append('</ul>'); in_list=False
            out.append(f'<p>{inline_md(line.replace("  "," "))}</p>')
    if in_list: out.append('</ul>')
    return '\n'.join(out)
def slugify(text):
    text=text.lower().translate(str.maketrans('àâäéèêëîïôöùûüç','aaaeeeeiioouuuc')); return re.sub(r'[^a-z0-9]+','-',text).strip('-')[:90] or 'publication'
def build_page(meta,body_html):
    title=meta.get('title','Publication Élan pour Tous'); date=meta.get('date',''); audience=meta.get('audience','general'); slug=slugify(title)
    desc='Patrick Billy, Élan pour Tous et Work-Test-Démo : IA inclusive, accessibilité, formation et recrutement par les compétences.'
    schema=json.dumps({'@context':'https://schema.org','@type':'Article','headline':title,'datePublished':date,'author':{'@type':'Person','name':'Patrick Billy'},'publisher':{'@type':'Organization','name':'Élan pour Tous'},'about':['IA inclusive','accessibilité','handicap','formation','Work-Test-Démo']},ensure_ascii=False)
    page=f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>{html.escape(title)} – Patrick Billy · Élan pour Tous</title><meta name="description" content="{html.escape(desc)}"/><meta name="author" content="Patrick Billy"/><meta name="robots" content="index,follow"/><link rel="stylesheet" href="../../assets/css/base.css"/><link rel="stylesheet" href="../../assets/css/layout.css"/><link rel="stylesheet" href="../../assets/css/components.css"/><link rel="stylesheet" href="../../assets/css/inner-pages.css"/><script type="application/ld+json">{schema}</script></head><body class="inner-page"><a class="skip-link" href="#main">Aller au contenu principal</a><header class="site-header"><nav class="inner-nav" aria-label="Navigation principale"><a class="inner-brand" href="../../index.html"><strong>Élan pour Tous</strong><span>IA inclusive · Patrick Billy</span></a><ul class="inner-menu"><li><a href="../../index.html">Accueil</a></li><li><a href="../ia-inclusive.html">IA inclusive</a></li><li><a href="../entreprises-organismes.html">Entreprises</a></li><li><a href="../formations.html">Formations</a></li><li><a href="../blog.html">Ressources</a></li><li><a href="../rendez-vous.html">Rendez-vous</a></li></ul></nav></header><main id="main" tabindex="-1"><section class="inner-hero"><div class="inner-wrap"><p class="inner-eyebrow">Publication validée · {html.escape(audience)}</p><h1>{html.escape(title)}</h1><p class="inner-lead">Patrick Billy · Élan pour Tous · <a href="../ia-inclusive.html">IA inclusive</a> · Work-Test-Démo</p></div></section><section class="inner-section"><article class="inner-wrap inner-card">{body_html}</article></section><section class="inner-section inner-section-alt"><div class="inner-wrap"><div class="inner-callout"><h2>Vous représentez une entreprise ou un centre de formation ?</h2><p>Partons de votre besoin concret et examinons si l’IA inclusive ou Work-Test-Démo peut apporter une réponse utile.</p><p><a class="inner-button inner-button-primary" href="../rendez-vous.html">Demander un rendez-vous</a> <a class="inner-button inner-button-secondary" href="../ia-inclusive.html">Approfondir l’IA inclusive</a></p></div></div></section></main><footer class="site-footer"><div class="inner-wrap inner-footer"><p>© Patrick Billy — Élan pour Tous</p><p><a href="../accessibilite.html">Accessibilité</a> · <a href="../mentions-legales.html">Mentions légales</a></p></div></footer><script src="../../assets/js/accessibility-options.js" defer></script></body></html>'''
    return slug,page
def update_blog_index(meta,slug):
    text=BLOG.read_text(encoding='utf-8')
    if START_MARKER not in text or END_MARKER not in text: raise SystemExit('Marqueurs absents.')
    title=html.escape(meta.get('title','Publication Élan pour Tous')); date=html.escape(meta.get('date','')); audience=html.escape(meta.get('audience','general'))
    card=f'<article class="inner-card" data-publication-slug="{html.escape(slug)}"><p class="inner-tag">{audience}</p><h3>{title}</h3><p>Publication validée le {date} par Patrick Billy — Élan pour Tous.</p><a class="inner-card-link" href="./publications/{html.escape(slug)}.html">Lire la publication</a> · <a class="inner-card-link" href="./rendez-vous.html">Demander un rendez-vous</a></article>'
    before,rest=text.split(START_MARKER,1); current,after=rest.split(END_MARKER,1); current=current.strip()
    if 'Aucune publication validée pour le moment' in current: current=''
    if f'data-publication-slug="{slug}"' not in current: current=card+('\n'+current if current else '')
    BLOG.write_text(f'{before}{START_MARKER}\n{current}\n{END_MARKER}{after}',encoding='utf-8')
def main():
    p=argparse.ArgumentParser(); p.add_argument('--draft',required=True); args=p.parse_args(); draft=(ROOT/args.draft).resolve()
    if draft.parent!=DRAFTS or draft.suffix.lower()!='.md': raise SystemExit('Publication refusée : brouillon invalide.')
    if not draft.exists(): raise SystemExit('Brouillon introuvable.')
    meta,body=parse_front_matter(draft.read_text(encoding='utf-8'))
    if meta.get('status')!='draft': raise SystemExit('Publication refusée : statut draft attendu.')
    slug,page=build_page(meta,markdown_to_html(body)); PUBLICATIONS.mkdir(parents=True,exist_ok=True); output=PUBLICATIONS/f'{slug}.html'
    if output.exists(): raise SystemExit('Publication déjà existante.')
    output.write_text(page,encoding='utf-8'); update_blog_index(meta,slug); pub=ROOT/'content'/'published'; pub.mkdir(parents=True,exist_ok=True); (pub/draft.name).write_text(draft.read_text(encoding='utf-8').replace('status: draft','status: published',1),encoding='utf-8'); draft.unlink(); print(output.relative_to(ROOT))
if __name__=='__main__': main()
