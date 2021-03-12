const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'

const googleSheetRepository = (spreadsheetId, values) => {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (error, content) => {
    if (error) return console.log('Error loading client secret file:', error)

    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), updateGoogleSheet(spreadsheetId, values))
  })
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (error, token) => {
    if (error) return getNewToken(oAuth2Client, callback)

    oAuth2Client.setCredentials(JSON.parse(token))

    callback(oAuth2Client)
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })

  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question('Enter the code from that page here: ', (code) => {
    rl.close()

    oAuth2Client.getToken(code, (error, token) => {
      if (error) return console.error('Error while trying to retrieve access token', error)

      oAuth2Client.setCredentials(token)

      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (error) => {
        if (error) return console.error(error)
        console.log('Token stored to', TOKEN_PATH)
      })

      callback(oAuth2Client)
    })
  })
}

/**
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
const updateGoogleSheet = (spreadsheetId, values, numberOfDev = 15) => async (auth) => {
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

module.exports = googleSheetRepository
