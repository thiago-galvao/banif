import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Cliente from '#models/cliente'
import Conta from '#models/conta'
import ClienteRepository from '#repositories/cliente_repository'
import ContaRepository from '#repositories/conta_repository'
import MailService from '#services/mail_service'

type CadastrarClienteInput = {
  fullName: string
  email: string
  password: string
  cpf: string
  cidade: string
  estado: string
  rua: string
  numero: string
}

export default class ClienteService {
  constructor(
    private clienteRepo = new ClienteRepository(),
    private contaRepo = new ContaRepository(),
    private mailService = new MailService()
  ) {}

  async cadastrar(data: CadastrarClienteInput) {
    const resultado = await db.transaction(async (trx) => {
      const user = await User.create(
        {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          role: 'cliente',
        },
        { client: trx }
      )

      const cliente = await Cliente.create(
        {
          userId: user.id,
          cpf: data.cpf,
          cidade: data.cidade,
          estado: data.estado.toUpperCase(),
          rua: data.rua,
          numero: data.numero,
        },
        { client: trx }
      )

      const totalContas = await this.contaRepo.count()
      const numero = String(10001 + totalContas).padStart(5, '0') + '-' + ((totalContas + 1) % 10)
      const conta = await Conta.create(
        {
          clienteId: cliente.id,
          agencia: '0001',
          numero,
          saldo: 0,
        },
        { client: trx }
      )

      return { user, cliente, conta }
    })

    await this.mailService
      .enviarBoasVindasCliente({
        nome: resultado.user.fullName ?? data.email,
        email: data.email,
        senha: data.password,
        agencia: resultado.conta.agencia,
        numero: resultado.conta.numero,
      })
      .catch(() => undefined)

    return resultado
  }

  async listar() {
    return this.clienteRepo.listAllWithUserAndConta()
  }
}
