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

// Import the state associations
const statemap = require('./statemap.json')

/**
  * ETL for Apple Mobile Tracking Data
  * @author Matt Hrushka <c19@hru.sh>
*/
module.exports.run = async _ => {


  // Try to get the file for the last 3 days
  let response = await fetch(config.sources.apple.metadataUrl)
  let metadata = await response.json()

  response = await fetch(`${config.sources.apple.dataUrl}${metadata.basePath}${metadata.regions['en-us'].csvPath}`)
  response = (response.status !== 200)
    ? false
    : response

  if (response === false) {
    throw 'Unable to find a from the last 3 days.'
  }

  let input = await response.text()

  const records = parse(input, {
    columns: true,
    skip_empty_lines: true
  })

  const data = []

  for (const record of records) {
    for (const prop in record) {

      // Skip fileds and only focus on values
      if (Object.keys(schema.fields).includes(prop)) {
        continue
      }

      const value = +record[prop]
      const hash_id = `${prop}_${record.transportation_type}_${record.region}`

      data.push({
        hash: crypto.createHash('md5').update(hash_id).digest("hex"),
        geo_type: record.geo_type,
        region: record.region,
        transportation_type: record.transportation_type,
        date: prop,
        value: value,
        state_abbv: statemap[record.region]
      })
    }
  }

  // Initialize Database if it hasn't been
  await Datastore.init(schema)
  await Datastore.insert(schema, data)

  return { success: true }

}