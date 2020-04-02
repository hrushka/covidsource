'use strict'

const fetch = require('node-fetch')
const moment = require('moment')

// Common API Configuration
const config = require('../apiconfig.json')
const data_census = require('../static/us_census.json')

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

    let state = (params.scopedVars) ? params.scopedVars.state.value.toUpperCase() : "ALL"
    let targets = {}

    params.targets.forEach(e => {
        targets[e.target] = []
    })

    console.log(event)

    // Are we asking for a state or the full country?
    const state_only = (state !== "ALL")
    const url = state_only ? 
        `${config.country.us.states.endpoint}?state=${state}` :
        config.country.us.endpoint

    // Fetch the data from the "state" historical data endpoint
    fetch(url)
        .then(res => res.json())
        .then(json => {

            let results = []

            // Get the times to filter by
            const time_from = moment(params.range.from).unix() * 1000
            const time_to = moment(params.range.to).unix() * 1000

            // Static Metrics
            const sc_data = data_census[state]

            json.forEach(e => {
                const unix_time = moment(e.date, 'YYYYMMDD').unix() * 1000

                // Exclude times outside of our range
                if (unix_time < time_from || unix_time > time_to) {
                    return
                }

                for (const prop in targets) {
                    if(prop == 'density' || prop == 'population'){
                        targets[prop].push([sc_data[prop], unix_time])
                    } else if (prop == 'testsPerThousand') {

                        const n_ttr = e.totalTestResults
                        const n_pop = sc_data.population

                        const tpc = n_ttr / (n_pop / 1000)

                        targets[prop].push([tpc, unix_time])

                    } else {
                        targets[prop].push([e[prop], unix_time])
                    }
                }
            })

            // Re-format the data into the JSON data source structure
            for (const prop in targets) {
                results.push({
                    target: prop,
                    datapoints: targets[prop]
                })
            }
            
            const response = {
                statusCode: 200,
                body: JSON.stringify(results),
            }

            callback(null, response)
        })
}