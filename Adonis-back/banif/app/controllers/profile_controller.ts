import type { HttpContext } from '@adonisjs/core/http'
import PerfilService from '#services/perfil_service'

export default class ProfileController {
  constructor(private perfilService = new PerfilService()) {}

  async show({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await this.perfilService.build(user)
    return response.ok({ status: 'success', data })
  }
}
