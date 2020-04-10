'use strict'

const ingest_ctp = require('./functions/pipeline/ctp')
const ingest_us_data = require('./functions/pipeline/us_data')

module.exports = {
    ingest_ctp: ingest_ctp.run,
    ingest_us_data: ingest_us_data.run
}