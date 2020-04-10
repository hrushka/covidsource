'use strict'

const fetch = require('node-fetch')
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
  * ETL for The US Census, County Level Resolution
  * @author Matt Hrushka <c19@hru.sh>
*/
module.exports.run = async _ => {

  // Fetch the data from the "state" historical data endpoint
  const response = await fetch(config.sources.us_census.dataUrl)
  const input = await response.json()

  let records = []
  for(var set of input){
    if(set[0] == "NAME"){
      continue
    }

    const names = set[0].split(', ')
    
    records.push({
      hash: crypto.createHash('md5').update(set[0]).digest("hex"),
      state_full: names[1],
      state_abbv: data_states[names[1]],
      county_full: names[0].replace(' County', ''),
      usc_state_id: +set[2],
      usc_county_id: +set[1],
      usc_density_2019: +set[3],
      usc_population_2019: +set[4]
    })

  }

  const t_s = moment().unix() * 1000

  // Initialize Database if it hasn't been
  await Datastore.init(schema)
  await Datastore.insert(schema,records)

  const t_e = moment().unix() * 1000

  return {success:true, milliseconds:t_e-t_s}
 
}