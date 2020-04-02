'use strict'

const fetch = require('node-fetch')
const moment = require('moment')
const ihme_data = require('../static/us_ihme.json')

/**
  * Returns a list of annotations for the specified metrics and time frame
  * @author Matt Hrushka <c19@hru.sh>  
  * @path /annotations 
  * @param {object} $event - a list of "targets" and time frame and filters
  * @return {object} - a JSON object representing an HTTP response
*/
module.exports.run = (event, _, callback) => {

  const params = JSON.parse(event.body)

  // Get the times to filter by
  const time_from = moment(params.range.from).unix() * 1000
  const time_to = moment(params.range.to).unix() * 1000

  const state = (params.variables.state) ? params.variables.state.value.toUpperCase() : "ALL"
  const query = params.annotation.query || false
  const ihmeid = ihme_data.states[state] || false

  console.log(state, query, ihmeid)

  let results = []

  // If state doesn't exist in our IHME data table, return no annotations
  if (ihmeid == false) {
    const response = {
      statusCode: 200,
      body: JSON.stringify(results),
    }

    callback(null, response)
    return
  }

  // Fetch the data from the interventions endpoint
  fetch(`https://covid19.healthdata.org/api/data/intervention?location=${ihmeid}`)
    .then(res => res.json())
    .then(json => {
      json.forEach(e => {

        console.log(e)

        const tag = ihme_data.tags[`${e.covid_intervention_measure_id}`] || false
        const timestamp = moment(e.date_reported, 'YYYY-MM-DD HH:mm:ss').unix() * 1000

        if (query !== false && query !== tag)
          return

        if (timestamp < time_from || timestamp > time_to) {
          return
        }

        results.push({
          "text": "",
          "title": e.covid_intervention_measure_name,
          "time": timestamp
        })
      })

      console.log(results)

      const response = {
        statusCode: 200,
        body: JSON.stringify(results),
      }

      callback(null, response)

    })
}