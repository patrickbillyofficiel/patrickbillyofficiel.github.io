# Bot éditorial — Élan pour Tous / Work-Test-Démo

Ce bot prépare des brouillons destinés aux entreprises, CFA, organismes de formation, référents handicap et acteurs de l'insertion.

## Principe

Le bot ne publie jamais directement vers LinkedIn ni vers une autre plateforme externe. Il génère des brouillons dans `content/drafts/` afin qu'une validation humaine soit faite avant toute publication.

## Fonctionnement

Le workflow GitHub Actions `Bot éditorial - brouillons` peut être lancé manuellement depuis l'onglet **Actions** avec deux paramètres :

- `topic` : sujet du post ;
- `audience` : entreprises, formation, insertion ou général.

Il fonctionne aussi automatiquement le lundi, le mercredi et le vendredi :

- lundi : entreprises / recrutement inclusif ;
- mercredi : CFA et organismes de formation / IA inclusive ;
- vendredi : structures pilotes / Work-Test-Démo.

## Identité éditoriale commune

Tous les brouillons rappellent :

- Patrick Billy ;
- Élan pour Tous ;
- Work-Test-Démo ;
- IA inclusive ;
- handicap et accessibilité ;
- formation ;
- recrutement par les compétences ;
- contact : `elanpourtous49@gmail.com`.

## Validation

Chaque fichier généré porte le statut `draft` et la mention : « Brouillon généré automatiquement. Validation humaine obligatoire avant publication. »

Cette première version est volontairement prudente. Une deuxième étape pourra ajouter un bouton de publication vers le site officiel après validation, puis une connexion à une API officielle de réseau social si elle est disponible et autorisée.
