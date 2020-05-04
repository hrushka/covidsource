'use strict'

const Client = require('serverless-mysql')
const moment = require('moment')

const table_prefix = "data_"

/**
  * Returns a singleton for an initialized Datastore class. This is
  * the main wrapper for the serverless-mysql DAO class.
  * @author Matt Hrushka <c19@hru.sh>
*/
class Datastore {
    constructor() {
        if (!Datastore.instance) {
            this.client = Client({
                config: {
                    //host: process.env.AURORA_HOST,
                    host: 'covidsource-prod-aurorardscluster-7qbcu285p7mw.cluster-cjbgyiupwga6.us-east-1.rds.amazonaws.com',
                    database: process.env.DB_NAME,
                    user: process.env.USERNAME,
                    password: process.env.PASSWORD
                }
            })
            Datastore.instance = this
        }
    }

    insert = async (schema, data) => {

        // Batch Data
        const batch_size = +process.env.BATCH_SIZE
        const data_size = data.length
        let data_count = 0

        let batch = []

        console.log({ batch_size, data_size })

        for (var d of data) {

            data_count++

            let values = []
            let fields = []
            for (var field in schema.fields) {

                const attrs = schema.fields[field]

                let value = d[field]
                switch (attrs.type) {
                    case "timestamp":
                        value = `"${moment.utc(value, attrs.format).format()}"`
                        break
                    case "decimal":
                    case "int":
                        value = (value === "") ? "null" : +value
                        break
                    case "string":
                        if (!value) {
                            value = "null"
                        } else {
                            value = `'${value.replace("'", "''")}'`
                        }
                    default:
                }

                fields.push(`\`${field}\``)
                values.push(value)
            }

            batch.push(`(${values.join(',')})`)

            if (batch.length == batch_size || data_count == data_size) {

                console.log({ batch_count: batch.length, data_count })

                const query = `REPLACE INTO ${table_prefix}${schema.name} (${fields.join(',')}) VALUES ${batch.join(',')}`
                await this.query(query)
                batch = []
            }
        }

        return
    }

    query = async (query) => {
        const results = await this.client.query(query)
        this.client.end()

        return results
    }

    /**
      * Creates a table if it doesn't exist based on the provided schema
    */
    init = async schema => {

        let fields = []

        Object.keys(schema.fields).forEach(elm => {

            let attrs = schema.fields[elm]

            let type = attrs.type
            switch (attrs.type) {
                case "string":
                    type = `VARCHAR(${attrs.maxLength})`
                    break
                default:
            }

            if (attrs.primary_key) {
                type += ' PRIMARY KEY'
            }

            fields.push(`\`${elm}\` ${type}`)
        })

        let indexes = []
        if(schema.indexes !== undefined){
            for(const index of schema.indexes){
                indexes.push(`INDEX (${index.join(',')})`)
            }
        }
        indexes = (indexes.length > 0) ? `,${indexes.join(',')}` : ''

        let query = `CREATE TABLE IF NOT EXISTS ${table_prefix}${schema.name} (${fields.join(',')}${indexes});`
        console.log(query)
        await this.client.query(query)
        this.client.end()

        return
    }
}

const ds_instance = new Datastore();
Object.freeze(ds_instance);

module.exports = {
    Datastore: ds_instance
}