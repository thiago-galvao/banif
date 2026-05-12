import type { HttpContext } from '@adonisjs/core/http'
import { depositoSaqueValidator, ajusteSaldoValidator } from '#validators/conta'
import ContaService from '#services/conta_service'

export default class ContasController {
  constructor(private contaService = new ContaService()) {}

  async depositar({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(depositoSaqueValidator)
      const user = auth.getUserOrFail()
      const { conta, movimentacao } = await this.contaService.depositar(user, payload)
      return response.ok({
        status: 'success',
        message: 'Deposito realizado.',
        data: {
          saldo: Number(conta.saldo),
          movimentacao: {
            id: movimentacao.id,
            tipo: movimentacao.tipo,
            valor: Number(movimentacao.valor),
          },
        },
      })
    } catch (error: any) {
      return response.status(error?.status ?? 400).send({
        status: 'error',
        message: error?.message ?? 'Erro ao depositar.',
        data: null,
      })
    }
  }

  async sacar({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(depositoSaqueValidator)
      const user = auth.getUserOrFail()
      const { conta, movimentacao } = await this.contaService.sacar(user, payload)
      return response.ok({
        status: 'success',
        message: 'Saque realizado.',
        data: {
          saldo: Number(conta.saldo),
          movimentacao: {
            id: movimentacao.id,
            tipo: movimentacao.tipo,
            valor: Number(movimentacao.valor),
          },
        },
      })
    } catch (error: any) {
      return response.status(error?.status ?? 400).send({
        status: 'error',
        message: error?.message ?? 'Erro ao sacar.',
        data: null,
      })
    }
  }

  async ajustarSaldo({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(ajusteSaldoValidator)
      const { conta, movimentacao } = await this.contaService.ajustarSaldo(payload)
      return response.ok({
        status: 'success',
        message: 'Ajuste registrado.',
        data: {
          saldo: Number(conta.saldo),
          movimentacao: {
            id: movimentacao.id,
            tipo: movimentacao.tipo,
            valor: Number(movimentacao.valor),
          },
        },
      })
    } catch (error: any) {
      return response.status(error?.status ?? 400).send({
        status: 'error',
        message: error?.message ?? 'Erro ao ajustar saldo.',
        data: null,
      })
    }
  }
}
