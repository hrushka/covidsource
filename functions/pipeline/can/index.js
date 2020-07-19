'use strict'

const fetch = require('node-fetch')
const parse = require('csv-parse/lib/sync')
const crypto = require('crypto')
const { Datastore } = require('../../../utils')

// Import the pipeline config
const config = require('../../../pipelineconfig.json')

// Import the schema for this data source
const schema = require('./schema.json')

// Import static state data
const data_states = require('../../../static/us_states.json')

/**
  * ETL for The Covid ActNow Org
  * @author Matt Hrushka <c19@hru.sh>
*/
module.exports.run = async _ => {

  // Fetch the data from the "state" historical data endpoint
  const response = await fetch(config.sources.can.dataUrl)
  const input = await response.text()

  const records = parse(input, {
    columns: true,
    skip_empty_lines: true
  })

  // Need to re-compute our own hashes as we've found multiple hashes per date/state pair
  for (var r in records) {
    const rec = records[r]
    const hash_id = `${rec.date}_${rec.countryName}_${rec.stateName}_${rec.countyName}`
    records[r].hash = crypto.createHash('md5').update(hash_id).digest("hex")
    records[r].state_abbv = data_states[rec.stateName]
    records[r].countyName = (rec.countyName !== undefined && rec.countyName !== "")
      ? records[r].countyName
      : "Unknown"
  }

  // Initialize Database if it hasn't been
  await Datastore.init(schema)
  await Datastore.insert(schema, records)

  return { success: true }

}