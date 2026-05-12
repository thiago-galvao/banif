import type { HttpContext } from '@adonisjs/core/http'
import { cadastrarClienteValidator } from '#validators/cliente'
import ClienteService from '#services/cliente_service'

export default class ClientesController {
  constructor(private clienteService = new ClienteService()) {}

  async index({ response }: HttpContext) {
    const clientes = await this.clienteService.listar()

    return response.ok({
      status: 'success',
      data: clientes.map((c) => ({
        id: c.id,
        nome: c.user?.fullName,
        email: c.user?.email,
        cpf: c.cpf,
        conta: c.conta
          ? {
              id: c.conta.id,
              agencia: c.conta.agencia,
              numero: c.conta.numero,
              saldo: Number(c.conta.saldo),
            }
          : null,
      })),
    })
  }

  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(cadastrarClienteValidator)
      const { user, cliente, conta } = await this.clienteService.cadastrar(payload)

      return response.created({
        status: 'success',
        message: 'Cliente cadastrado com sucesso',
        data: {
          id: cliente.id,
          nome: user.fullName,
          email: user.email,
          cpf: cliente.cpf,
          conta: {
            id: conta.id,
            agencia: conta.agencia,
            numero: conta.numero,
            saldo: Number(conta.saldo),
          },
        },
      })
    } catch (error: any) {
      return response.badRequest({
        status: 'error',
        message: error?.messages
          ? 'Erro. Verifique os dados inseridos.'
          : (error?.message ?? 'Erro ao cadastrar cliente.'),
        data: error?.messages ?? null,
      })
    }
  }
}
