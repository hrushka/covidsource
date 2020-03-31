'use strict'

/**
  * Returns a list of annotations for the specified metrics and time frame
  * @author Matt Hrushka <c19@hru.sh>  
  * @path /annotations 
  * @param {object} $event - a list of "targets" and time frame and filters
  * @return {object} - a JSON object representing an HTTP response
*/
module.exports.run = async _ => {
    return {
        statusCode: 200,
        body: JSON.stringify({ endpoint: 'annotations' }),
    }
}