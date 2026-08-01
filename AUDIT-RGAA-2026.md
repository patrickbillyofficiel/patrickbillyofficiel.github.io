# Pré-audit RGAA 4.1.2 — Élan pour Tous

**Mise à jour : 1er août 2026**  
**Responsable : Patrick Billy**  
**État déclaré : non conforme**

## Statut

Le site ne revendique aucun taux de conformité. Aucun audit exhaustif et représentatif des 106 critères du RGAA 4.1.2 n’a encore été réalisé. Les travaux consignés ici sont des corrections techniques et éditoriales préparatoires.

## Périmètre prioritaire traité

- accueil principal ;
- pages d’accueil française, anglaise, espagnole, allemande et malagasy ;
- projet, formations, tarifs et demande de devis ;
- contact, mentions légales, confidentialité et conditions d’intervention ;
- déclaration d’accessibilité et plan du site ;
- Bio, Compétences, Systèmes et Entreprises/organismes ;
- Ressources, Débats et archive Cuisine LDL ;
- page RGAA et méthode d’usage complémentaire ;
- comparateur local d’offre et de profil ;
- accueil du portfolio ;
- page 404 ;
- feuilles de style communes et scripts principaux.

## Corrections appliquées

### Éléments obligatoires et structure

- langue principale déclarée sur les pages traitées ;
- titres de pages explicites ;
- un titre principal par page ;
- régions `header`, `nav`, `main` et `footer` ;
- hiérarchie des titres simplifiée ;
- listes et tableaux structurés ;
- liens externes ouvrant une nouvelle fenêtre signalés dans leur intitulé.

### Navigation et clavier

- liens d’évitement harmonisés ;
- focus clavier visible et contrasté ;
- cibles interactives agrandies ;
- `aria-current` utilisé pour la page active ;
- menu mobile pilotable au clavier et fermeture avec Échap ;
- choix de langue conservé sur petit écran ;
- plan du site accessible ajouté.

### Présentation

- liens soulignés hors composants de type bouton ;
- couleurs des liens visités sécurisées ;
- contrastes renforcés ;
- mise en page adaptable ;
- prise en compte de `prefers-reduced-motion` ;
- prise en compte du mode de couleurs forcées ;
- retour à la ligne et redimensionnement du texte améliorés.

### Formulaires et scripts

- libellés visibles ;
- aides reliées avec `aria-describedby` ;
- groupes de champs avec `fieldset` et `legend` ;
- messages d’erreur et de statut annoncés ;
- aucun envoi automatique sans action explicite ;
- comparateur remplacé par une analyse locale sans classement, score personnel ou rejet automatique ;
- tableau de résultat avec légende et en-têtes.

### Contenus historiques

- chemins relatifs cassés supprimés sur les pages corrigées ;
- anciennes appellations « RGAA+++++ » et évaluations en étoiles retirées des pages actives ;
- blog transformé en espace de ressources ;
- débats limités aux contenus réellement disponibles ;
- page Cuisine LDL identifiée comme archive secondaire et non médicale ;
- portfolio relié aux pages actives et à la déclaration d’accessibilité.

## Contrôle automatique

Le workflow `.github/workflows/accessibility.yml` lance Pa11y CI avec le standard WCAG 2 niveau AA sur les pages listées dans `.pa11yci.json`.

Ce contrôle reste complémentaire. Il ne remplace pas :

- la vérification de la pertinence des alternatives textuelles ;
- les tests NVDA, VoiceOver et TalkBack ;
- les tests clavier complets ;
- le contrôle à 200 % et 400 % ;
- l’analyse des changements de langue ;
- la vérification de tous les contenus historiques ;
- le calcul réglementaire du taux de conformité.

## Travaux restant à réaliser

1. Finaliser l’inventaire des pages historiques, projets et doublons.
2. Auditer un échantillon représentatif selon la méthode RGAA.
3. Contrôler toutes les images, cadres et médias.
4. Tester les parcours avec les technologies d’assistance de référence.
5. Corriger les non-conformités relevées.
6. Calculer le taux réel.
7. Mettre à jour la déclaration avec le résultat de l’audit.

## Pages de référence

- `/pages/accessibilite.html` : déclaration d’accessibilité ;
- `/pages/plan-du-site.html` : plan du site ;
- `/pages/rgaa.html` : méthode RGAA ;
- `/pages/cv-ia.html` : démonstration interactive ;
- `/.pa11yci.json` : pages testées automatiquement ;
- `/.github/workflows/accessibility.yml` : contrôle continu.

## Contact accessibilité

- Courriel : `elanpourtous49@gmail.com`
- Téléphone : `07 83 33 67 57`
