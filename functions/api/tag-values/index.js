'use strict'

const state_data = require('../../../static/us_states.json')

/**
  * Returns a list of metrics available
  * @author Matt Hrushka <c19@hru.sh>
  * @path /tag-values
  * @param {object} $event - nothing useful
  * @return {object} - a JSON object representing an HTTP response
*/
module.exports.run = async event => {

    const params = JSON.parse(event.body)

    console.log(params)

    let results = []

    if(params.key == 'State'){
        Object.keys(state_data).forEach(name=>{
            const abbv = state_data[name]
            results.push({
                text:name,
                value:abbv
            })
        })
    }

    return {
        statusCode: 200,
        body: JSON.stringify(results)
    }
}