const gitHubRepository = require('./infrastructure/github/github')
const googleSheetsRepository = require('./infrastructure/google_sheets/google_sheets')

const GITHUB_TOKEN = process.env.GITHUB_KPI_TOKEN
const SPREADSHEET_ID = process.env.GITHUB_KPI_SPREADSHEET_ID

const main = async () => {
  const params = process.argv.slice(2);

  if (params.length === 0) {
    console.error('Il faut le owner et le repo en paramètre.')
  }
  else {
    const versionControlRepository = gitHubRepository(GITHUB_TOKEN, params[0], params[1])

    const pullRequests = await versionControlRepository.pullRequests()
    const pullRequestsAndReviewComments = await versionControlRepository.addReviewComments(pullRequests)
    const dataForGoogleSheets = versionControlRepository.transformForGoogleSheets(pullRequestsAndReviewComments)

    googleSheetsRepository(SPREADSHEET_ID, dataForGoogleSheets)
  }
}

main()
