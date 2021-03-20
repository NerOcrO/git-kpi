// const gitHubRepository = require('./infrastructure/github/byDevelopper')
// const googleSheetsRepository = require('./infrastructure/google_sheets/byDevelopper')
const gitHubRepository = require('./infrastructure/github/byIteration')
const googleSheetsRepository = require('./infrastructure/google_sheets/byIteration')

const GITHUB_TOKEN = process.env.GITHUB_KPI_TOKEN
const SPREADSHEET_ID = process.env.GITHUB_KPI_SPREADSHEET_ID

const main = async () => {
  const params = process.argv.slice(2);

  if (params.length === 0) {
    console.error('Il faut le owner et le repo en paramètre.')
  }
  else {
    // By developper.
    // Ex.: node index.js pass-culture pass-culture-pro
    // const versionControlRepository = gitHubRepository(GITHUB_TOKEN, params[0], params[1])

    // const pullRequests = await versionControlRepository.pullRequests()
    // const pullRequestsAndReviewComments = await versionControlRepository.addReviewComments(pullRequests)
    // const dataForGoogleSheets = versionControlRepository.transformForGoogleSheets(pullRequestsAndReviewComments)

    // googleSheetsRepository(SPREADSHEET_ID, dataForGoogleSheets)

    // By iteration.
    // Ex.: node index.js pass-culture pass-culture-pro 2021-03-10T14:00:00Z 2021-03-17T14:00:00Z 127
    const versionControlRepository = gitHubRepository(GITHUB_TOKEN, params[0], params[1], params[2], params[3])

    const pullRequests = await versionControlRepository.pullRequests(20)
    const pullRequestsAndReviewComments = await versionControlRepository.addReviewComments(pullRequests)
    const dataForGoogleSheets = versionControlRepository.transformForGoogleSheets(pullRequestsAndReviewComments)

    googleSheetsRepository(SPREADSHEET_ID, dataForGoogleSheets, params[4])
  }
}

main()
