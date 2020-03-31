'use strict'

const fetch = require('node-fetch')
const moment = require('moment')

// Common API Configuration
const config = require('../apiconfig.json')

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

    let state = (params.scopedVars) ? params.scopedVars.state.value.toUpperCase() : "IL"
    let targets = {}

    params.targets.forEach(e => {
        targets[e.target] = []
    })

    console.log(event)

    // Fetch the data from the "state" historical data endpoint
    fetch(`${config.states.endpoint}?state=${state}`)
        .then(res => res.json())
        .then(json => {

            let results = []

            // Get the times to filter by
            const time_from = moment(params.range.from).unix() * 1000
            const time_to = moment(params.range.to).unix() * 1000

            json.forEach(e => {
                const unix_time = moment(e.date, 'YYYYMMDD').unix() * 1000

                // Exclude times outside of our range
                if (unix_time < time_from || unix_time > time_to) {
                    return
                }

                for (const prop in targets) {
                    targets[prop].push([e[prop], unix_time])
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