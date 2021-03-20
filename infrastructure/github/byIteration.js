const fetch = require('node-fetch')

const addReviewComments = require('./addReviewComments')

const gitHubRepository = (token, owner, repo, startDate = '', endDate = '') => {
  return {
    pullRequests: async (per_page = 100) => {
      const dayDiff = (start, end) => {
        return Number(Number(end.getTime() / 86_400_000 - start.getTime() / 86_400_000).toFixed(0))
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
        const start = startDate === '' ? new Date('1970') : new Date(startDate)
        const end = endDate === '' ? new Date('3000') : new Date(endDate)

        dataFromPullRequests.forEach((pullRequest) => {
          if (
            pullRequest.user.login !== 'dependabot[bot]'
            && new Date(pullRequest.closed_at).getTime() > start.getTime()
            && new Date(pullRequest.closed_at).getTime() < end.getTime()
          ) {
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

    addReviewComments: addReviewComments(token, owner, repo),

    transformForGoogleSheets: (pullRequestsAndReviewComments) => {
      const dataForGoogleSheets = []

      pullRequestsAndReviewComments.forEach((data) => {
        dataForGoogleSheets.push([
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
