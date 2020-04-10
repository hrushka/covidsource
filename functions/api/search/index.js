'use strict'

// Common API Configuration
const config = require('../../../apiconfig.json')

const data_states = require('../../../static/us_states.json')

/**
  * Returns a list of metrics available
  * @author Matt Hrushka <c19@hru.sh>
  * @path /search
  * @param {object} $event - nothing useful
  * @return {object} - a JSON object representing an HTTP response
*/
module.exports.run = async event => {

  const params = JSON.parse(event.body)

  console.log(params)

  if (params.target == "#states") {
    const results = []
    Object.keys(data_states).forEach(k => {
      results.push(k)
    })
    return {
      statusCode: 200,
      body: JSON.stringify(results)
    }
  }

  let state = (params.scopedVars) ? params.scopedVars.state.value : "ALL"
  const metrics = (state === "ALL") ? config.country.us.metrics : config.country.us.states.metrics

  return {
    statusCode: 200,
    body: JSON.stringify(metrics),
  }
}