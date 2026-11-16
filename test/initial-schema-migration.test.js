const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const migrationsDirectory = path.join(__dirname, '..', 'migrations')
const migrationFiles = fs.readdirSync(migrationsDirectory)
  .filter((file) => file.endsWith('.js'))

test('project has one complete initial schema migration', async () => {
  assert.equal(migrationFiles.length, 1)

  const InitialSchema = require(path.join(migrationsDirectory, migrationFiles[0]))
  const queries = []
  const queryRunner = { query: async (sql) => queries.push(sql) }

  await new InitialSchema().up(queryRunner)

  for (const table of ['users', 'goods', 'goods_infos', 'cart_items', 'orders']) {
    assert.ok(queries.some((sql) => sql.includes(`CREATE TABLE "${table}"`)))
  }
  assert.ok(queries.some((sql) => sql.includes('CONSTRAINT "chk_cart_items_count" CHECK')))
})
