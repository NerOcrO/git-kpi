const fetch = require('node-fetch')

const addReviewComments = (token, owner, repo) => {
  return async (pullRequests) => {
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
  }
}

module.exports = addReviewComments
