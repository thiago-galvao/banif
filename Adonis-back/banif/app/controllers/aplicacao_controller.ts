import type { HttpContext } from '@adonisjs/core/http'
import { aplicarValidator, resgatarValidator } from '#validators/aplicacao'
import AplicacaoService from '#services/aplicacao_service'

export default class AplicacaoController {
  constructor(private aplicacaoService = new AplicacaoService()) {}

  async index({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const aplicacoes = await this.aplicacaoService.listar(user)

      const cliente = await user.related('cliente').query().preload('conta').first()
      const conta = cliente?.conta

      return response.ok({
        status: 'success',
        data: {
          conta: conta
            ? {
                agencia: conta.agencia,
                numero: conta.numero,
                saldo: Number(conta.saldo),
              }
            : null,
          aplicacoes,
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

  async aplicar({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(aplicarValidator)
      const user = auth.getUserOrFail()
      const data = await this.aplicacaoService.aplicar(user, payload)
      return response.ok({
        status: 'success',
        message: 'Valor aplicado com sucesso!',
        data,
      })
    } catch (error: any) {
      return response.status(error?.status ?? 400).send({
        status: 'error',
        message: error?.message ?? 'Ocorreu um erro inesperado.',
        data: null,
      })
    }
  }

  async resgatar({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(resgatarValidator)
      const user = auth.getUserOrFail()
      const data = await this.aplicacaoService.resgatar(user, payload)
      return response.ok({
        status: 'success',
        message: 'Resgate realizado com sucesso!',
        data,
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
