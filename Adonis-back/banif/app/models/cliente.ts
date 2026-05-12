import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Conta from '#models/conta'

export default class Cliente extends BaseModel {
  static table = 'clientes'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare cpf: string

  @column()
  declare cidade: string

  @column()
  declare estado: string

  @column()
  declare rua: string

  @column()
  declare numero: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasOne(() => Conta)
  declare conta: HasOne<typeof Conta>
}
