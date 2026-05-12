import type { HttpContext } from '@adonisjs/core/http'
import { transferenciaPixValidator } from '#validators/pix'
import PixService from '#services/pix_service'

export default class PixController {
  constructor(private pixService = new PixService()) {}

  async show({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await this.pixService.dadosTela(user)
    return response.ok({ status: 'success', data })
  }

  async store({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(transferenciaPixValidator)
      const user = auth.getUserOrFail()
      const data = await this.pixService.transferir(user, {
        emailDestino: payload.email,
        valor: payload.valor,
        descricao: payload.descricao,
      })

      return response.ok({
        status: 'success',
        message: 'Pix realizado com sucesso!',
        data: {
          email: data.emailDestino,
          valor: data.valor,
          tipo: 'pix',
          saldoAtual: data.saldoAtual,
        },
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
