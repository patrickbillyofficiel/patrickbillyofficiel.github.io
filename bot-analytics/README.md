# Bot de veille IA Inclusive — V1

Objectif : mesurer les signaux utiles sur les sites Élan pour Tous / IA Inclusive sans cookies publicitaires, sans stockage d'adresse IP et sans identification nominative des visiteurs.

## Ce que la V1 mesure
- pages vues ;
- clics vers Contact ;
- clics vers Demande de devis ;
- téléchargements PDF ;
- provenance par nom d'hôte du référent lorsque le navigateur la fournit ;
- pages les plus consultées sur 7, 30 ou 90 jours.

## Architecture
GitHub Pages -> `tracker.js` -> Cloudflare Worker -> D1 -> `dashboard.html`.

Le Worker utilise un binding D1 (`env.DB`). Le tableau de bord `/stats` est protégé par `DASHBOARD_TOKEN`. Les requêtes provenant du site public sont limitées par `ALLOWED_ORIGINS`.

## Déploiement Cloudflare
1. Créer une base D1 nommée `elan-analytics`.
2. Exécuter `schema.sql` sur cette base.
3. Déployer `worker.js` comme Module Worker.
4. Relier la base avec un binding nommé `DB`.
5. Définir `ALLOWED_ORIGINS=https://patrickbillyofficiel.github.io`.
6. Ajouter un secret `DASHBOARD_TOKEN` avec une valeur longue et aléatoire. Ne jamais publier cette clé dans GitHub.
7. Copier l'URL finale du Worker, par exemple `https://elan-analytics-bot.<compte>.workers.dev`.

## Activation sur le site
Juste avant `</body>` dans les pages à mesurer :

```html
<script>
window.ELAN_ANALYTICS = {
  endpoint: "https://ADRESSE-DU-WORKER.workers.dev",
  site: "patrickbillyofficiel.github.io"
};
</script>
<script src="/bot-analytics/tracker.js" defer></script>
```

## Tableau de bord
Ouvrir `/bot-analytics/dashboard.html`, saisir l'adresse du Worker et la clé privée. La clé reste seulement dans `sessionStorage` du navigateur et n'est pas écrite dans le dépôt.

## Confidentialité
La V1 ne stocke ni adresse IP, ni User-Agent, ni cookie, ni empreinte de navigateur. Elle ne permet donc pas de dire « telle personne ou telle entreprise a consulté la page ». Elle permet de mesurer des signaux d'intérêt : visites, provenance générale, demandes de devis, contacts et téléchargements.

Avant une mise en production complète, vérifier que la page de confidentialité du site décrit correctement cette mesure d'audience et les éventuelles obligations applicables.
