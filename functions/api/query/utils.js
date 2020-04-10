'use strict'

// Static Data
const data_census = require('../../../static/us_census.json')
const data_geos = require('../../../static/us_geohashes.json')

/**
  * Formats the results based on the "type" specified by Grafana (table | timeseries)
  * @author Matt Hrushka <c19@hru.sh>
  * @param {object} $state - the current state (or ALL) of the data being formatted
  * @param {object} $targets - the "targets" object passed in from Grafana, for context
  * @param {object} $target_data - the metric data we compiled from the endpoint
  * @return {array} - an array of formatted results (this could be of mixed type)
*/
module.exports.formatResults = (state, targets, target_data) => {

    const results = []

    // Re-format the data into the JSON data source structure
    targets.forEach(t => {

        const { target, type, data } = t

        if (type == 'timeseries') {
            results.push({
                target: target,
                datapoints: target_data[target]
            })
        } else if (type == 'table') {
            results.push({
                columns: [{
                    text: target,
                    type: "number"
                }, {
                    text: "Time",
                    type: "time"
                }],
                rows: target_data[target],
                type: "table",
                name: target,
                tags: {
                    geohash: data_geos[state]
                }
            })
        }
    })

    console.log(results)

    return results
}

/**
  * Computes a custom metric from the available data passed in or static sources
  * @author Matt Hrushka <c19@hru.sh>
  * @param {object} $state - the current state (or ALL) of the data being formatted
  * @param {object} $target - the mertic name to be computed
  * @param {object} $data - the current dataset to be used for computing
  * @return {object} - a single metric as the result. Can be a number or string
*/
module.exports.computeMetric = (state, target, data) => {

    const sc_data = data_census[state]

    if (target == 'density' || target == 'population') {
        return sc_data[target]
    } else if (target == 'testsPerThousand') {
        const n_ttr = data.totalTestResults
        const n_pop = sc_data.population
        const tpc = n_ttr / (n_pop / 1000)

        return tpc
    } else if (target == 'prevalenceRate') {

        const n_positive = data.positive
        const n_population = sc_data.population

        return n_positive / n_population

    } else if (target == 'incidenceRate') {

        const n_newPositive = data.positiveIncrease
        const n_population = sc_data.population

        return (n_newPositive / n_population) * 1000

    } else if (target == 'caseFatalityRate') {

        const n_deaths = data.death
        const n_positive = data.positive

        return (n_deaths / n_positive)
    }

    console.log('Unable to compute unknown metric', target)
    return null
}