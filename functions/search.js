'use strict'

// Common API Configuration
const config = require('../apiconfig.json')

const data_states = require('../static/us_states.json')

/**
  * Returns a list of metrics available
  * @author Matt Hrushka <c19@hru.sh>
  * @path /search
  * @param {object} $event - nothing useful
  * @return {object} - a JSON object representing an HTTP response
*/
module.exports.run = async event => {

  const params = JSON.parse(event.body)

  // If the request is for a specific target...
  if (params.target !== undefined) {
    if (params.target == "#states") {

      const results = []
      Object.keys(data_states).forEach(k => {
        results.push(k)
      })

      return {
        statusCode: 200,
        body: JSON.stringify(results)
      }

    } else {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      }
    }
  }

  let state = (params.scopedVars) ? params.scopedVars.state.value.toUpperCase() : "ALL"

  const state_only = (state !== "ALL")
  const metrics = state_only ? config.country.us.states.metrics : config.country.us.metrics

  return {
    statusCode: 200,
    body: JSON.stringify(metrics),
  }
}