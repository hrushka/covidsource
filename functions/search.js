'use strict'

// Common API Configuration
const config = require('../apiconfig.json')

/**
  * Returns a list of metrics available
  * @author Matt Hrushka <c19@hru.sh>
  * @path /search
  * @param {object} $event - nothing useful
  * @return {object} - a JSON object representing an HTTP response
*/
module.exports.run = async event => {

    const params = JSON.parse(event.body)
    let state = (params.scopedVars) ? params.scopedVars.state.value.toUpperCase() : "ALL"
    
    const state_only = (state !== "ALL")
    const metrics = state_only ? config.country.us.states.metrics : config.country.us.metrics

    return {
        statusCode: 200,
        body: JSON.stringify(config.states.metrics),
    }
}