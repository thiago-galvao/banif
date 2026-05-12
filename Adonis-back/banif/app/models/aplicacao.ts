import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Conta from '#models/conta'

export type TipoAplicacao = 'poupanca' | 'titulos' | 'acoes'

export default class Aplicacao extends BaseModel {
  static table = 'aplicacoes'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare contaId: number

  @column()
  declare tipo: TipoAplicacao

  @column({
    consume: (value: string | number) => Number(value),
  })
  declare valorAplicado: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Conta)
  declare conta: BelongsTo<typeof Conta>
}
