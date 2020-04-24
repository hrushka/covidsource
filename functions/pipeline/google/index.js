'use strict'

const fetch = require('node-fetch')
const parse = require('csv-parse/lib/sync')
const moment = require('moment')
const crypto = require('crypto')
const { Datastore } = require('../../../utils')

// Import the pipeline config
const config = require('../../../pipelineconfig.json')

// Import the schema for this data source
const schema = require('./schema.json')

// Import static state data
const data_states = require('../../../static/us_states.json')

/**
  * ETL for Google Mobile Tracking Data
  * @author Matt Hrushka <c19@hru.sh>
*/
module.exports.run = async _ => {

  const cb = crypto.createHash('md5').update(moment().toString()).digest("hex")
  const response = await fetch(`${config.sources.google.dataUrl}?cachebust=${cb}`)
  const input = await response.text()

  const records = parse(input, {
    columns: true,
    skip_empty_lines: true
  })

  // Augment data with state abbreviation for quicker lookup and hash for primary key
  for (var r in records) {

    const rec = records[r]
    const hash_id = `${rec.country_region_code}_${rec.sub_region_1}_${rec.sub_region_2}_${rec.date}`

    records[r].hash = crypto.createHash('md5').update(hash_id).digest("hex")
    records[r].state_abbv = data_states[rec.sub_region_1] // Add in state abbreviation
    records[r].sub_region_2 = records[r].sub_region_2.replace(' County','') // Strip the "County" label from counties
  }

  // Initialize Database if it hasn't been
  await Datastore.init(schema)
  await Datastore.insert(schema, records)

  return { success: true }
}