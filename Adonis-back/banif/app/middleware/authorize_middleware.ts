import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

type AuthorizatonOptions = { roles: string[] } | { permissions: string[] }

export default class AuthorizeMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn, options: AuthorizatonOptions) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({
        status: 'error',
        message: 'Sessao invalida ou expirada. Por favor, realize o login novamente.',
        data: null,
      })
    }

    if ('roles' in options) {
      if (!options.roles.includes(user.role)) {
        return response.forbidden({
          status: 'error',
          message: 'Acesso negado.',
          data: null,
        })
      }
    }

    if ('permissions' in options) {
      const permissoesDoUsuario = user.permissions ?? []
      const temPermissao = options.permissions.some((p) => permissoesDoUsuario.includes(p))
      if (!temPermissao) {
        return response.forbidden({
          status: 'error',
          message: 'Acesso negado.',
          data: null,
        })
      }
    }

    return next()
  }
}
