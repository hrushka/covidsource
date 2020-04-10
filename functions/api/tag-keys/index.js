'use strict'

/**
  * Returns a list of metrics available
  * @author Matt Hrushka <c19@hru.sh>
  * @path /tag-keys
  * @param {object} $event - nothing useful
  * @return {object} - a JSON object representing an HTTP response
*/
module.exports.run = async event => {

    return {
        statusCode: 200,
        body: JSON.stringify([
            {"type":"string","text":"Country"},
            {"type":"string","text":"State"}
        ]),
    }
}