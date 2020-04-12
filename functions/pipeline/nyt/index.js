'use strict'

const fetch = require('node-fetch')
const crypto = require('crypto')
const parse = require('csv-parse/lib/sync')
const { Datastore } = require('../../../utils')

// Import the pipeline config
const config = require('../../../pipelineconfig.json')

// Import the schema for this data source
const schema = require('./schema.json')

// Import static state data
const data_states = require('../../../static/us_states.json')

/**
  * ETL for The New York Times US county dataset
  * @author Matt Hrushka <c19@hru.sh>
*/
module.exports.run = async _ => {

  // Fetch the data from the "state" historical data endpoint
  const response = await fetch(config.sources.nyt_counties.dataUrl)
  const input = await response.text()

  const records = parse(input, {
    columns: true,
    skip_empty_lines: true
  })

  // Augment data with state abbreviation for quicker lookup and hash for primary key
  for (var r in records) {

    const rec = records[r]
    const hash_id = `${rec.date}_${rec.county}_${rec.state}`

    records[r].hash = crypto.createHash('md5').update(hash_id).digest("hex")
    records[r].state_abbv = data_states[rec.state]
  }

  // Initialize Database if it hasn't been
  await Datastore.init(schema)
  await Datastore.insert(schema, records)

  return { success: true }

}