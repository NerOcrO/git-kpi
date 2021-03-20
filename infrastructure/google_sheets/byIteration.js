const fs = require('fs')
const { google } = require('googleapis')

const authorize = require('./authentification')

const googleSheetRepository = (spreadsheetId, values, numberOfIteration) => {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (error, content) => {
    if (error) return console.log('Error loading client secret file:', error)

    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), updateGoogleSheet(spreadsheetId, values, numberOfIteration))
  })
}

const updateGoogleSheet = (spreadsheetId, values, numberOfIteration) => {
  /**
   * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
   */
  return async (auth) => {
    const sheets = google.sheets({ version: 'v4', auth })

    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `ite${numberOfIteration}!A2:F`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      })
    }
    catch (error) {
      console.error(error)
    }
  }
}

module.exports = googleSheetRepository
