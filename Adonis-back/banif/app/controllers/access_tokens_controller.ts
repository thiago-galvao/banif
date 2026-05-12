import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/user'
import AuthService from '#services/auth_service'

export default class AccessTokensController {
  constructor(private authService = new AuthService()) {}

  async store({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const { user, token } = await this.authService.login(email, password)

      return response.ok({
        status: 'success',
        message: 'Acesso liberado!',
        data: {
          token: token.value!.release(),
          user: {
            id: user.id,
            nome: user.fullName,
            email: user.email,
            regra: user.role,
            permissions: user.permissions,
          },
        },
      })
    } catch (error) {
      return response.unauthorized({
        status: 'error',
        message: 'Credenciais invalidas',
        data: null,
      })
    }
  }

  async destroy({ auth, response }: HttpContext) {
    await this.authService.logout(auth.getUserOrFail())
    return response.ok({ status: 'success', message: 'Logout realizado.' })
  }
}
