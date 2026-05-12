import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'aplicacoes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('conta_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('contas')
        .onDelete('CASCADE')

      // tipo: poupanca, titulos, acoes
      table.enum('tipo', ['poupanca', 'titulos', 'acoes']).notNullable()
      table.decimal('valor_aplicado', 14, 2).notNullable().defaultTo(0)

      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()

      table.unique(['conta_id', 'tipo'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
