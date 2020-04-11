'use strict'

const ingest_ctp = require('./functions/pipeline/ctp')
const ingest_us = require('./functions/pipeline/us_data')
const ingest_nyt = require('./functions/pipeline/nyt_county')

module.exports = {
    ingest_ctp: ingest_ctp.run,
    ingest_us: ingest_us.run,
    ingest_nyt: ingest_nyt.run
}