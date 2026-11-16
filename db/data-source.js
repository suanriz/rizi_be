const { DataSource } = require('typeorm')
const path = require('node:path')
const config = require('../config/index')
const entities = require('../entities')

const dataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: config.db.synchronize,
  ssl: config.db.ssl,
  entities: Object.values(entities),
  migrations: [path.join(__dirname, '../migrations/*.js')],
  subscribers: []
})

module.exports = { dataSource }
