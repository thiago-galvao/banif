import type { HttpContext } from '@adonisjs/core/http'
import ExtratoService from '#services/extrato_service'

export default class ExtratoController {
  constructor(private extratoService = new ExtratoService()) {}

  async index({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const transacoes = await this.extratoService.gerar(user)
      return response.ok({
        status: 'success',
        data: { transacoes },
      })
    } catch (error: any) {
      return response.status(error?.status ?? 400).send({
        status: 'error',
        message: error?.message ?? 'Ocorreu um erro inesperado.',
        data: null,
      })
    }
  }
}
