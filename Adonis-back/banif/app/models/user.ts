import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Cliente from '#models/cliente'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static table = 'users'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: 'gerente' | 'cliente'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasOne(() => Cliente)
  declare cliente: HasOne<typeof Cliente>

  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  get isGerente() {
    return this.role === 'gerente'
  }

  get isCliente() {
    return this.role === 'cliente'
  }

  get permissions() {
    if (this.role === 'gerente') {
      return [
        'clientes.list',
        'clientes.create',
        'contas.create',
        'movimentacoes.create',
      ]
    }
    return [
      'perfil.show',
      'pix.send',
      'extrato.show',
      'aplicacao.manage',
    ]
  }
}
