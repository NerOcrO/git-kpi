const fetch = require('node-fetch')

const gitHubRepository = (token, owner, repo) => {
  return {
    pullRequests: async (per_page = 100) => {
      const dayDiff = (start, end) => {
        return Number(Number(end.getTime() / 86400000 - start.getTime() / 86400000).toFixed(0))
      }
      const pullRequests = []

      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&per_page=${per_page}`,
          {
            headers: { Authorization: `token ${token}` }
          }
        )
        const dataFromPullRequests = await response.json()

        dataFromPullRequests.forEach((pullRequest) => {
          if (pullRequest.user.login !== 'dependabot[bot]') {
            pullRequests.push({
              user: pullRequest.user.login,
              id: pullRequest.number,
              title: pullRequest.title,
              url: pullRequest.html_url,
              daysOpened: dayDiff(new Date(pullRequest.created_at), new Date(pullRequest.closed_at)),
              numberOfReviewComments: 0,
            })
          }

        })
      }
      catch (error) {
        console.error(error)
      }

      return pullRequests
    },

    addReviewComments: async (pullRequests) => {
      return Promise.all(pullRequests.map(async (pullRequest) => {
        try {
          const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/pulls/${pullRequest.id}/comments`,
            {
              headers: { Authorization: `token ${token}` }
            }
          )
          const reviewComments = await response.json()

          pullRequest.numberOfReviewComments = reviewComments.length

          return pullRequest
        }
        catch (error) {
          console.error(error)
        }
      }))
    },

    transformForGoogleSheets: (pullRequestsAndReviewComments) => {
      const dataForGoogleSheets = {}

      pullRequestsAndReviewComments.forEach((data) => {
        dataForGoogleSheets[data.user] = dataForGoogleSheets[data.user] || []

        dataForGoogleSheets[data.user].push([
          `=LIEN_HYPERTEXTE("${data.url}";"${data.title}")`,
          data.numberOfReviewComments,
          '=MEDIANE(B2:B)',
          '=MOYENNE(B2:B)',
          data.daysOpened,
          data.user
        ])
      })

      return dataForGoogleSheets
    }
  }
}

module.exports = gitHubRepository
