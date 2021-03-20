const fs = require('fs')
const { google } = require('googleapis')

const authorize = require('./authentification')

const googleSheetRepository = (spreadsheetId, values) => {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (error, content) => {
    if (error) return console.log('Error loading client secret file:', error)

    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), updateGoogleSheet(spreadsheetId, values))
  })
}

const updateGoogleSheet = (spreadsheetId, values, numberOfDev = 15) => {
  /**
   * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
   */
  return async (auth) => {
    const sheets = google.sheets({ version: 'v4', auth })

    try {
      const sheetName = (index) => `dev${index}!A2:F`
      const ranges = []

      for (let index = 1; index < numberOfDev + 1; index++) {
        ranges.push(sheetName(index))
      }
      await sheets.spreadsheets.values.batchClear({ spreadsheetId, ranges })

      let range = ''
      index = 1
      for (const value of Object.keys(values)) {
        range = sheetName(index++)

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: values[value] },
        })
      }
    }
    catch (error) {
      console.error(error)
    }
  }
}

module.exports = googleSheetRepository
