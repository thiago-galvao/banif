import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Conta from '#models/conta'

export type TipoMovimentacao =
  | 'deposito'
  | 'saque'
  | 'ajuste_credito'
  | 'ajuste_debito'
  | 'pix_enviado'
  | 'pix_recebido'
  | 'aplicacao_investida'
  | 'aplicacao_resgatada'

export type Sentido = 'entrada' | 'saida'

export default class Movimentacao extends BaseModel {
  static table = 'movimentacoes'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare contaId: number

  @column()
  declare tipo: TipoMovimentacao

  @column()
  declare sentido: Sentido

  @column({
    consume: (value: string | number) => Number(value),
  })
  declare valor: number

  @column()
  declare descricao: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Conta)
  declare conta: BelongsTo<typeof Conta>

  get valorComSinal(): string {
    const sinal = this.sentido === 'entrada' ? '+' : '-'
    return `${sinal}${this.valor.toFixed(2)}`
  }
}
