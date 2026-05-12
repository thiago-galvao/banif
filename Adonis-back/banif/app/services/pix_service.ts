import db from '@adonisjs/lucid/services/db'
import { Exception } from '@adonisjs/core/exceptions'
import User from '#models/user'
import Movimentacao from '#models/movimentacao'
import UserRepository from '#repositories/user_repository'
import ClienteRepository from '#repositories/cliente_repository'
import ContaRepository from '#repositories/conta_repository'

type PixInput = {
  emailDestino: string
  valor: number
  descricao?: string
}

export default class PixService {
  constructor(
    private userRepo = new UserRepository(),
    private clienteRepo = new ClienteRepository(),
    private contaRepo = new ContaRepository()
  ) {}

  async transferir(remetente: User, input: PixInput) {
    const clienteOrigem = await remetente.related('cliente').query().preload('conta').first()
    const contaOrigem = clienteOrigem?.conta
    if (!contaOrigem) {
      throw new Exception('Remetente nao possui conta corrente.', { status: 400 })
    }

    if (contaOrigem.saldo < input.valor) {
      throw new Exception('Saldo insuficiente para efetuar a transferencia.', { status: 400 })
    }

    const destinatarioUser = await this.userRepo.findByEmail(input.emailDestino)
    if (!destinatarioUser || destinatarioUser.role !== 'cliente') {
      throw new Exception('Conta de destino invalida.', { status: 404 })
    }
    if (destinatarioUser.id === remetente.id) {
      throw new Exception('Nao e possivel transferir para si mesmo.', { status: 400 })
    }

    const clienteDestino = await this.clienteRepo.findByUserId(destinatarioUser.id)
    if (!clienteDestino) {
      throw new Exception('Conta de destino invalida.', { status: 404 })
    }
    const contaDestino = await this.contaRepo.findByClienteId(clienteDestino.id)
    if (!contaDestino) {
      throw new Exception('Conta de destino invalida.', { status: 404 })
    }

    return db.transaction(async (trx) => {
      contaOrigem.useTransaction(trx)
      contaDestino.useTransaction(trx)

      contaOrigem.saldo = Number(contaOrigem.saldo) - input.valor
      await contaOrigem.save()

      contaDestino.saldo = Number(contaDestino.saldo) + input.valor
      await contaDestino.save()

      await Movimentacao.create(
        {
          contaId: contaOrigem.id,
          tipo: 'pix_enviado',
          sentido: 'saida',
          valor: input.valor,
          descricao: input.descricao ?? `Pix para ${input.emailDestino}`,
        },
        { client: trx }
      )

      await Movimentacao.create(
        {
          contaId: contaDestino.id,
          tipo: 'pix_recebido',
          sentido: 'entrada',
          valor: input.valor,
          descricao: input.descricao ?? `Pix de ${remetente.email}`,
        },
        { client: trx }
      )

      return {
        emailDestino: input.emailDestino,
        valor: input.valor,
        saldoAtual: Number(contaOrigem.saldo),
      }
    })
  }

  async dadosTela(remetente: User) {
    const cliente = await remetente.related('cliente').query().preload('conta').first()
    const conta = cliente?.conta
    return {
      email: remetente.email,
      conta: conta ? { saldo: Number(conta.saldo) } : null,
    }
  }
}
