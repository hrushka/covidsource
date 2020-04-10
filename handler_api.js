'use strict'

const annotations = require('./functions/api/annotations')
const query = require('./functions/api/query')
const search = require('./functions/api/search')
const tagKeys = require('./functions/api/tag-keys')
const tagValues = require('./functions/api/tag-values')
const test = require('./functions/api/test')

module.exports = {
    apannotations: annotations.run,
    query: query.run,
    search: search.run,
    tagKeys: tagKeys.run,
    tagValues: tagValues.run,
    test: test.run
}