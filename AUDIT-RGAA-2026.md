# Pré-audit RGAA 4.1.2 — Élan pour Tous

**Mise à jour : 1er août 2026**  
**Responsable : Patrick Billy**  
**État déclaré : non conforme**

## Statut

Le site ne revendique aucun taux de conformité. Aucun audit exhaustif et représentatif des 106 critères du RGAA 4.1.2 n’a encore été réalisé. Les travaux consignés ici sont des corrections techniques, éditoriales et organisationnelles préparatoires.

Les options d’affichage ajoutées au site sont des aides facultatives. Elles ne remplacent ni la structure accessible des pages, ni les tests avec des technologies d’assistance, ni l’audit RGAA.

## Périmètre prioritaire traité

- accueil principal ;
- pages d’accueil française, anglaise, espagnole, allemande et malagasy ;
- projet, formations, tarifs et demande de devis ;
- contact, mentions légales, confidentialité et conditions d’intervention ;
- déclaration d’accessibilité, plan du site, schéma pluriannuel et plan d’action annuel ;
- lecteur oral et protocole de tests avec lecteurs d’écran ;
- Bio, Compétences, Systèmes et Entreprises/organismes ;
- Ressources, Débats et archive Cuisine LDL ;
- page RGAA et méthode d’usage complémentaire ;
- comparateur local d’offre et de profil ;
- portfolio et pages de projets ;
- page 404 ;
- pages historiques et multilingues présentes dans le dépôt ;
- feuilles de style communes et scripts principaux.

## Options d’accessibilité facultatives

Un bouton fixe **« Options d’accessibilité »** est déployé dans les pages HTML du dépôt. Les préférences sont enregistrées localement sur l’appareil lorsque le navigateur autorise le stockage local.

Options proposées :

- taille du texte : 100 %, 112,5 %, 125 %, 150 % ou 200 % ;
- contraste renforcé noir sur blanc ;
- mode sombre renforcé ;
- police système simple sans empattement ;
- espacement renforcé des lettres, mots et lignes ;
- alignement à gauche ;
- largeur de lecture limitée ;
- liens textuels renforcés ;
- focus clavier renforcé ;
- réduction des animations ;
- réinitialisation des préférences ;
- accès direct à la lecture orale.

Le panneau utilise un dialogue natif, restitue le focus à sa fermeture et déclare sa langue française lorsqu’il apparaît dans une page traduite.

## Déploiement global

Le workflow `.github/workflows/inject-accessibility-options.yml` contrôle les fichiers HTML et ajoute le script du panneau lorsqu’il manque. Le premier passage a créé le commit `84f87d54f12ae7f58ee33211f388fcb4fe8516f0`.

Le contrôle évite les doublons et ne modifie pas les pages déjà équipées.

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
- option de focus renforcé ;
- cibles interactives agrandies ;
- `aria-current` utilisé pour la page active ;
- menu mobile pilotable au clavier et fermeture avec Échap ;
- choix de langue conservé sur petit écran ;
- plan du site accessible ajouté ;
- retour du focus après fermeture du panneau d’options.

### Présentation

- liens soulignés hors composants de type bouton ;
- couleurs des liens visités sécurisées ;
- contrastes renforcés ;
- mise en page adaptable ;
- prise en compte de `prefers-reduced-motion` ;
- option de suppression des animations ;
- prise en compte du mode de couleurs forcées ;
- retour à la ligne et redimensionnement du texte améliorés ;
- options de taille, contraste, espacement et largeur de lecture.

### Formulaires et scripts

- libellés visibles ;
- aides reliées avec `aria-describedby` ;
- groupes de champs avec `fieldset` et `legend` ;
- messages d’erreur et de statut annoncés ;
- aucun envoi automatique sans action explicite ;
- comparateur remplacé par une analyse locale sans classement, score personnel ou rejet automatique ;
- tableau de résultat avec légende et en-têtes ;
- lecteur oral sans démarrage automatique, avec Lire, Pause, Reprendre et Arrêter.

### Organisation et publication

- déclaration d’accessibilité publiée ;
- schéma pluriannuel volontaire 2026–2028 publié ;
- plan d’action accessibilité 2026 publié ;
- contact accessibilité et voies de recours publiés ;
- état « non conforme » maintenu tant qu’un audit valide n’est pas disponible.

### Contenus historiques

- chemins relatifs cassés supprimés sur les pages corrigées ;
- anciennes appellations « RGAA+++++ » et évaluations en étoiles retirées des pages actives ;
- blog transformé en espace de ressources ;
- débats limités aux contenus réellement disponibles ;
- page Cuisine LDL identifiée comme archive secondaire et non médicale ;
- portfolio relié aux pages actives et à la déclaration d’accessibilité.

## Contrôle automatique

Le workflow `.github/workflows/accessibility.yml` lance Pa11y CI avec le standard WCAG 2 niveau AA sur les pages listées dans `.pa11yci.json`, y compris la déclaration, la lecture orale, le schéma pluriannuel et le plan annuel.

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
5. Tester chaque combinaison d’options à fort zoom et sur mobile.
6. Corriger les non-conformités relevées.
7. Calculer le taux réel.
8. Mettre à jour la déclaration avec le résultat de l’audit.

## Pages et fichiers de référence

- `/pages/accessibilite.html` : déclaration d’accessibilité ;
- `/pages/plan-du-site.html` : plan du site ;
- `/pages/schema-pluriannuel-accessibilite.html` : schéma 2026–2028 ;
- `/pages/plan-actions-accessibilite-2026.html` : plan annuel ;
- `/pages/lecture-orale.html` : lecture orale et protocole lecteurs d’écran ;
- `/pages/rgaa.html` : méthode RGAA ;
- `/assets/js/accessibility-options.js` : panneau de préférences ;
- `/assets/css/accessibility-options.css` : styles des préférences ;
- `/.pa11yci.json` : pages testées automatiquement ;
- `/.github/workflows/accessibility.yml` : contrôle continu ;
- `/.github/workflows/inject-accessibility-options.yml` : vérification du déploiement global.

## Contact accessibilité

- Courriel : `elanpourtous49@gmail.com`
- Téléphone : `07 83 33 67 57`
