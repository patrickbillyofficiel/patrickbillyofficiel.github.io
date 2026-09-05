#!/usr/bin/env python3
"""Bot éditorial simple pour Patrick Billy / Élan pour Tous / Work-Test-Démo.

Le script génère des brouillons Markdown à partir d'un sujet et d'un public cible.
Aucune publication externe n'est effectuée automatiquement : validation humaine obligatoire.
"""

from __future__ import annotations

import argparse
import datetime as dt
import re
from pathlib import Path

BRAND = "Patrick Billy — Élan pour Tous — Work-Test-Démo"
CONTACT = "elanpourtous49@gmail.com"

AUDIENCE_INTROS = {
    "entreprises": "Entreprises, DRH et responsables recrutement",
    "formation": "CFA, organismes de formation, formateurs et référents handicap",
    "insertion": "Acteurs de l'emploi, de l'insertion et du handicap",
    "general": "Entreprises, organismes de formation et partenaires de l'inclusion",
}


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9àâäéèêëîïôöùûüç -]", "", text)
    repl = str.maketrans("àâäéèêëîïôöùûüç", "aaaeeeeiioouuuc")
    text = text.translate(repl)
    text = re.sub(r"[\s-]+", "-", text).strip("-")
    return text or "publication"


def build_post(topic: str, audience: str) -> str:
    label = AUDIENCE_INTROS.get(audience, AUDIENCE_INTROS["general"])
    today = dt.date.today().isoformat()
    title = f"{topic} — une approche concrète de l'IA inclusive"

    return f"""---\ntitle: \"{title}\"\ndate: {today}\naudience: \"{audience}\"\nstatus: draft\nbrand: \"{BRAND}\"\n---\n\n# {title}\n\n**Pour : {label}**\n\nEt si l'on partait d'une situation réelle plutôt que d'une promesse technologique ?\n\n## Le sujet\n\n{topic}\n\nAvec **Élan pour Tous** et **Work-Test-Démo**, l'objectif est de tester des usages concrets de l'IA inclusive, de l'accessibilité et de la mise en situation professionnelle, sans remplacer la décision humaine.\n\n## Ce que nous proposons\n\n- partir d'un besoin réel rencontré par la structure ;\n- observer les compétences dans une situation concrète ;\n- adapter les consignes et les outils lorsque cela est nécessaire ;\n- utiliser l'IA comme assistance, jamais comme décisionnaire ;\n- débriefer avec les professionnels et les participants ;\n- mesurer ce qui fonctionne et ce qui doit être amélioré.\n\n## Pourquoi expérimenter ?\n\nParce qu'un CV, un diplôme ou un handicap ne suffisent pas toujours à révéler ce qu'une personne sait réellement faire. Une expérimentation courte peut permettre de mieux comprendre les compétences, les besoins d'aménagement et les conditions de réussite.\n\n## Appel aux structures pilotes\n\nJe recherche des **entreprises, CFA, organismes de formation, référents handicap et acteurs de l'insertion** souhaitant tester une démarche concrète sur le terrain.\n\n**Patrick Billy**  \nFondateur — Élan pour Tous  \nCréateur — Work-Test-Démo  \nIA inclusive • Handicap • Accessibilité • Formation • Recrutement par les compétences\n\nContact : **{CONTACT}**\n\n> Brouillon généré automatiquement. Validation humaine obligatoire avant publication.\n"""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--topic", required=True)
    parser.add_argument(
        "--audience",
        default="general",
        choices=["entreprises", "formation", "insertion", "general"],
    )
    parser.add_argument("--output-dir", default="content/drafts")
    args = parser.parse_args()

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    stamp = dt.datetime.now().strftime("%Y%m%d-%H%M")
    filename = f"{stamp}-{slugify(args.topic)[:60]}.md"
    path = output_dir / filename
    path.write_text(build_post(args.topic, args.audience), encoding="utf-8")
    print(path)


if __name__ == "__main__":
    main()
