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
module.exports.run = async _ => {

    return {
        statusCode: 200,
        body: JSON.stringify(config.states.metrics),
    }
}