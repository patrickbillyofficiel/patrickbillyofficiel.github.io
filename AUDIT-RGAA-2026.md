# Pré-audit RGAA 4.1.2 — Élan pour Tous

**Date de mise à jour : 31 juillet 2026**  
**Responsable du site : Patrick Billy**  
**État déclaré : non conforme**

## Pourquoi le site reste déclaré non conforme

Un audit exhaustif et représentatif des 106 critères du RGAA 4.1.2 n’a pas encore été réalisé. Les corrections présentes dans le dépôt constituent une mise à niveau technique et un pré-audit. Elles ne permettent pas d’annoncer un taux de conformité officiel.

## Périmètre prioritaire contrôlé

- page d’accueil ;
- pages d’accueil française, anglaise, espagnole, allemande et malagasy ;
- présentation du projet ;
- catalogue des formations ;
- tarifs et formats ;
- demande de devis ;
- contact ;
- Bio et Compétences ;
- comparateur accessible d’offre et de profil ;
- page RGAA et méthode d’accessibilité vécue ;
- déclaration d’accessibilité ;
- page 404 ;
- feuilles de style communes et portfolio ;
- scripts de navigation et de langues.

## Corrections intégrées

### Navigation et clavier

- liens d’évitement harmonisés pour les classes `skip-link` et `skiplink` ;
- focus visible sur les liens, boutons, champs, listes déroulantes et éléments avec `tabindex` ;
- menu mobile avec `aria-expanded`, `aria-controls` et fermeture par la touche Échap ;
- choix de langue conservé sur petit écran ;
- cibles interactives agrandies ;
- repères `aria-current="page"` normalisés.

### Présentation

- liens identifiables sans dépendre uniquement de la couleur ;
- contrastes renforcés dans les thèmes clair et sombre ;
- couleurs des liens visités sécurisées sur les boutons et bandeaux sombres ;
- prise en compte de `prefers-reduced-motion` ;
- prise en compte du mode de couleurs forcées ;
- amélioration du redimensionnement du texte et du retour à la ligne ;
- mise en page responsive des grilles et formulaires.

### Structure et contenus

- page d’accueil simplifiée et structurée ;
- pages de langue harmonisées avec `lang` et `hreflang` ;
- pages Bio et Compétences remises au gabarit actuel ;
- auto-évaluations graphiques en étoiles retirées de la page Compétences ;
- page RGAA réécrite selon la version 4.1.2 ;
- expressions « RGAA+++++ » ou « RGAA***** » retirées des pages principales ou présentées comme non officielles ;
- déclaration d’accessibilité publiée avec un statut honnête ;
- page 404 réécrite ;
- informations de langue renforcées sur les liens multilingues.

### Formulaires et scripts

- champs associés à des libellés visibles ;
- groupes de champs structurés avec `fieldset` et `legend` ;
- champs obligatoires signalés ;
- messages de statut avec région en direct ;
- aucune transmission automatique des données sans action explicite de l’utilisateur ;
- comparateur de CV remplacé par une démonstration locale fonctionnelle ;
- tableau de résultat doté d’une légende, d’en-têtes et de cellules de ligne ;
- absence de score automatique ou de décision de recrutement ;
- scripts de navigation et de langue manquants ou incohérents corrigés.

## Contrôle automatique

Le workflow `.github/workflows/accessibility.yml` exécute Pa11y CI sur un échantillon de pages prioritaires. Ce contrôle est volontairement non bloquant pendant la phase de correction des anciennes pages.

Les outils automatiques ne couvrent qu’une partie des critères. Ils ne vérifient pas correctement, entre autres :

- la pertinence de toutes les alternatives textuelles ;
- la cohérence éditoriale des titres et liens ;
- la qualité d’usage avec un lecteur d’écran ;
- l’ordre de lecture dans toutes les situations ;
- la compréhension des consignes et des erreurs ;
- la pertinence des changements de langue ;
- les parcours complexes et l’usage réel à fort zoom.

## Travaux restant à réaliser

1. Finaliser l’inventaire des pages historiques, débats, projets et doublons multilingues.
2. Corriger ou retirer les gabarits obsolètes et les liens relatifs cassés.
3. Vérifier chaque image selon sa fonction réelle.
4. Contrôler tous les liens ouvrant une nouvelle fenêtre.
5. Tester les parcours complets au clavier.
6. Tester avec NVDA, VoiceOver et TalkBack.
7. Tester à 200 % de zoom et avec une largeur équivalente à 400 %.
8. Vérifier les contrastes de chaque état interactif.
9. Constituer un échantillon représentatif selon la méthode RGAA.
10. Calculer le taux réel et mettre à jour la déclaration.

## Pages et fichiers de référence

- `/pages/accessibilite.html` : déclaration d’accessibilité ;
- `/pages/rgaa.html` : présentation de la méthode RGAA ;
- `/pages/methode-rgaa-plus-plus-plus-plus-plus.html` : tests d’usage complémentaires ;
- `/pages/cv-ia.html` : démonstration interactive accessible ;
- `/.pa11yci.json` : échantillon des tests automatisés ;
- `/.github/workflows/accessibility.yml` : contrôle continu.

## Contact accessibilité

Courriel : `elanpourtous49@gmail.com`  
Téléphone : `07 83 33 67 57`
