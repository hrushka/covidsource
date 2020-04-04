'use strict'

const fetch = require('node-fetch')
const moment = require('moment')

// Common API Configuration
const config = require('../../apiconfig.json')

// Static Data
const data_states = require('../../static/us_states.json')

// Utilities
const utils = require('./utils')

/**
  * Returns a list of data for the specified metrics and time frame
  * @author Matt Hrushka <c19@hru.sh>
  * @path /query 
  * @param {object} $event - a list of "targets" and time frame and filters
  * @param {function} $callback - call with (error,results) when complete
  * @return {object} - a JSON object representing an HTTP response
*/
module.exports.run = (event, _, callback) => {

    const params = JSON.parse(event.body)

    // Get the state, if none treat it as all US
    let state = (params.scopedVars) ? params.scopedVars.state.value : "ALL"
    state = (state !== "ALL" && data_states[state]) ? data_states[state].toUpperCase() : state

    // Are we asking for a state or the full country?
    const state_only = (state !== "ALL")
    const url = state_only ? 
        `${config.country.us.states.endpoint}?state=${state}` :
        config.country.us.endpoint

    // Fetch the data from the "state" historical data endpoint
    fetch(url)
        .then(res => res.json())
        .then(json => {

            // Get the times to filter by
            const time_from = moment(params.range.from).unix() * 1000
            const time_to = moment(params.range.to).unix() * 1000

            let target_data = {}

            json.forEach(e => {
                const unix_time = moment(e.date, 'YYYYMMDD').unix() * 1000

                // Exclude times outside of our range
                if (unix_time < time_from || unix_time > time_to) {
                    return
                }

                params.targets.forEach(t => {
                    
                    const { target, type, data } = t

                    if(target_data[target] === undefined){
                        target_data[target] = []
                    }

                    // Pull the metric from the data directly, or compute it if 
                    // it's not in the original set
                    let metric = e[target] || utils.computeMetric(state, target, e)
                    target_data[target].push([metric, unix_time])
                })
            })

            const results = utils.formatResults(state, params.targets, target_data)
            const response = {
                statusCode: 200,
                body: JSON.stringify(results),
            }

            callback(null, response)
        })
}