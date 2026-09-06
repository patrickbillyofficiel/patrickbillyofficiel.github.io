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

## Déploiement Cloudflare — procédure exacte

Depuis un ordinateur avec Node.js installé :

```bash
cd bot-analytics
npm install
npm run login
npm run db:create
```

La commande `db:create` renvoie un `database_id`. Copier `wrangler.toml.example` vers `wrangler.toml`, puis remplacer `REMPLACER_PAR_ID_D1` par cet identifiant.

Ensuite :

```bash
npm run db:init
npm run deploy
npm run secret
```

Lors de `npm run secret`, saisir une longue clé privée pour `DASHBOARD_TOKEN`. Ne jamais publier cette clé dans GitHub.

Après le déploiement, Cloudflare affiche une adresse de type :

```text
https://elan-analytics-bot.<compte>.workers.dev
```

Conserver cette URL : elle doit être renseignée dans la configuration du site.

## Activation sur le site

Juste avant `</body>` dans chaque page à mesurer :

```html
<script>
window.ELAN_ANALYTICS = {
  endpoint: "https://ADRESSE-DU-WORKER.workers.dev",
  site: "patrickbillyofficiel.github.io"
};
</script>
<script src="/bot-analytics/tracker.js" defer></script>
```

La page d'accueil charge déjà le tracker, mais il reste inactif tant que `endpoint` n'est pas renseigné avec l'URL réelle du Worker.

## Tableau de bord

Ouvrir `/bot-analytics/dashboard.html`, saisir l'adresse du Worker et la clé privée `DASHBOARD_TOKEN`. La clé reste seulement dans `sessionStorage` du navigateur et n'est pas écrite dans le dépôt.

## Confidentialité

La V1 ne stocke ni adresse IP, ni User-Agent, ni cookie, ni empreinte de navigateur. Elle ne permet donc pas de dire « telle personne ou telle entreprise a consulté la page ». Elle permet de mesurer des signaux d'intérêt : visites, provenance générale, demandes de devis, contacts et téléchargements.

Avant une mise en production complète, vérifier que la page de confidentialité du site décrit correctement cette mesure d'audience et les éventuelles obligations applicables.
