'use strict'

const moment = require('moment')
const us_stats = require('../static/us_stats.json')

/**
  * Returns a list of annotations for the specified metrics and time frame
  * @author Matt Hrushka <c19@hru.sh>  
  * @path /annotations 
  * @param {object} $event - a list of "targets" and time frame and filters
  * @return {object} - a JSON object representing an HTTP response
*/
module.exports.run = async event => {

  const params = JSON.parse(event.body)

  // Get the times to filter by
  const time_from = moment(params.range.from).unix() * 1000
  const time_to = moment(params.range.to).unix() * 1000

  const state = (params.variables.state) ? params.variables.state.value.toUpperCase() : "ALL"
  const stats = us_stats[state] || []

  const query = params.annotation.query || false

  let results = []

  stats.forEach(e => {

    if (query !== false && e.tag !== query)
      return

    results.push({
      "text": e.text,
      "title": e.title,
      "isRegion": true,
      "time": moment(e.time, 'YYYYMMDD').unix() * 1000,
      "timeEnd": (e.timeEnd) ? moment(e.timeEnd, 'YYYYMMDD').unix() * 1000 : undefined,
      "tags": []
    })
  })

  return {
    statusCode: 200,
    body: JSON.stringify(results),
  }
}