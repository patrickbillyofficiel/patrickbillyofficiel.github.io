# Bot éditorial — Élan pour Tous / Work-Test-Démo

Ce bot prépare des brouillons destinés aux entreprises, CFA, organismes de formation, référents handicap et acteurs de l'insertion.

## 1. Génération des brouillons

Le workflow GitHub Actions **Bot éditorial - brouillons** génère des fichiers dans `content/drafts/`.

Il peut être lancé manuellement avec :

- `topic` : sujet du post ;
- `audience` : entreprises, formation, insertion ou général.

Il fonctionne aussi automatiquement :

- lundi : entreprises / recrutement inclusif ;
- mercredi : CFA et organismes de formation / IA inclusive ;
- vendredi : structures pilotes / Work-Test-Démo.

## 2. Validation humaine obligatoire

Aucun brouillon n'est publié automatiquement.

Pour publier un texte validé :

1. ouvrir l'onglet **Actions** du dépôt ;
2. choisir **Valider et publier un brouillon** ;
3. cliquer sur **Run workflow** ;
4. saisir le chemin exact du fichier sous `content/drafts/` ;
5. choisir **PUBLIER** dans le champ de confirmation ;
6. lancer le workflow.

Si la confirmation reste sur **ANNULER**, rien n'est publié.

## 3. Ce que fait le bouton de publication

Le script `scripts/publish_draft.py` :

- vérifie que le fichier est bien un `.md` directement présent dans `content/drafts/` ;
- vérifie que son statut est `draft` ;
- transforme le contenu validé en page HTML accessible ;
- ajoute des métadonnées SEO ;
- ajoute des données structurées Schema.org de type `Article` avec Patrick Billy comme auteur et Élan pour Tous comme éditeur ;
- crée la page dans `pages/publications/` ;
- archive le brouillon source dans `content/published/` avec le statut `published` ;
- supprime le brouillon de `content/drafts/` afin d'éviter une double publication.

## 4. Identité éditoriale commune

Les contenus rappellent de manière cohérente :

- Patrick Billy ;
- Élan pour Tous ;
- Work-Test-Démo ;
- IA inclusive ;
- handicap et accessibilité ;
- formation ;
- recrutement par les compétences ;
- contact : `elanpourtous49@gmail.com`.

## 5. Réseaux sociaux

Cette version ne publie pas directement sur LinkedIn ni sur une autre plateforme externe. Une connexion future ne devra utiliser qu'une API officielle et conserver une validation humaine avant diffusion.
