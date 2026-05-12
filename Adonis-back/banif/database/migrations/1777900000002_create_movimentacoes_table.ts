import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movimentacoes'

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

      // tipo: deposito, saque, pix_enviado, pix_recebido,
      //       aplicacao_investida, aplicacao_resgatada
      table.string('tipo', 30).notNullable()

      // sentido: entrada (+) ou saida (-)
      table.enum('sentido', ['entrada', 'saida']).notNullable()

      table.decimal('valor', 14, 2).notNullable()
      table.string('descricao').nullable()

      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
