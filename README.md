# KPI sur les commentaires de review

## Pré-requis

- Créer un [token](https://github.com/settings/tokens) ;
- Créer un spread sheet et récupérer son identifiant ;
  - Y créer plusieurs onglets avec les noms dev1, dev2, dev3... ;
- [Cliquer sur le bouton "Enable the Google Sheets API"](https://developers.google.com/sheets/api/quickstart/nodejs) ;
  - Récupérer le fichier `credentials.json` et le mettre à la racine du projet ;
- Les mettre dans son .(bash|zsh)rc ;
  - `export GITHUB_KPI_TOKEN='...'` ;
  - `export GITHUB_KPI_SPREADSHEET_ID='...'` ;
- En lançant le script, il sera demandé d'aller sur une URL pour avoir un jeton qu'il faudra coller dans le prompt.

## Usage

- `node index.js [OWNER] [REPO]` ;
- A savoir qu'il y a un quota de 5000 requêtes ;
- Ne fonctionne qu'avec GitHub pour le moment.

## Aides

- [List pull requests](https://docs.github.com/en/rest/reference/pulls#list-pull-requests) ;
- [List reviews for a pull request](https://docs.github.com/en/rest/reference/pulls#list-reviews-for-a-pull-request) ;
- [Rate limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) ;
- [Google Sheets: Node.js Quickstart](https://developers.google.com/sheets/api/quickstart/nodejs) ;
- [REST Resource: spreadsheets.values](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values).
