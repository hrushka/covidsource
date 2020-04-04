'use strict'

const annotations = require('./functions/annotations')
const query = require('./functions/query')
const search = require('./functions/search')
const tagKeys = require('./functions/tag-keys')
const tagValues = require('./functions/tag-values')
const test = require('./functions/test')

module.exports = {
    annotations: annotations.run,
    query: query.run,
    search: search.run,
    tagKeys: tagKeys.run,
    tagValues: tagValues.run,
    test: test.run
}