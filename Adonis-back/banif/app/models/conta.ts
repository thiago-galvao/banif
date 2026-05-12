import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Cliente from '#models/cliente'
import Movimentacao from '#models/movimentacao'
import Aplicacao from '#models/aplicacao'

export default class Conta extends BaseModel {
  static table = 'contas'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clienteId: number

  @column()
  declare agencia: string

  @column()
  declare numero: string

  @column({
    consume: (value: string | number) => Number(value),
  })
  declare saldo: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Cliente)
  declare cliente: BelongsTo<typeof Cliente>

  @hasMany(() => Movimentacao)
  declare movimentacoes: HasMany<typeof Movimentacao>

  @hasMany(() => Aplicacao)
  declare aplicacoes: HasMany<typeof Aplicacao>
}
