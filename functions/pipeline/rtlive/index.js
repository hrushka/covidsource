'use strict'

const fetch = require('node-fetch')
const parse = require('csv-parse/lib/sync')
const crypto = require('crypto')
const { Datastore } = require('../../../utils')

// Import the pipeline config
const config = require('../../../pipelineconfig.json')

// Import the schema for this data source
const schema = require('./schema.json')

/**
  * ETL for Rt Live data
  * @author Matt Hrushka <c19@hru.sh>
*/
module.exports.run = async _ => {

  // Fetch the data from the "state" historical data endpoint
  const response = await fetch(config.sources.rtlive.dataUrl)
  const input = await response.text()

  const records = parse(input, {
    columns: true,
    skip_empty_lines: true
  })

  // Need to re-compute our own hashes as we've found multiple hashes per date/state pair
  for (var r in records) {
    const rec = records[r]
    const hash_id = `${rec.date}_${rec.region}`
    records[r].hash = crypto.createHash('md5').update(hash_id).digest("hex")
  }

  // Initialize Database if it hasn't been
  await Datastore.init(schema)
  await Datastore.insert(schema, records)

  return { success: true }

}