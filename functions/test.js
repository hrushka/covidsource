'use strict'

/**
  * Returns a 200 HTTP status code to let grafana know the server is good to go
  * @author Matt Hrushka <c19@hru.sh>
  * @path /test
  * @param {object} $event - nothing useful
  * @return {object} - a JSON object representing an HTTP response
*/
module.exports.run = async _ => {
    return {
        statusCode: 200,
        body: JSON.stringify({}),
    }
}