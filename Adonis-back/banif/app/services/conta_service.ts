import db from '@adonisjs/lucid/services/db'
import { Exception } from '@adonisjs/core/exceptions'
import User from '#models/user'
import Movimentacao from '#models/movimentacao'
import type { TipoMovimentacao } from '#models/movimentacao'
import ContaRepository from '#repositories/conta_repository'

type DepositoSaqueInput = {
  valor: number
  descricao?: string
}

type AjusteSaldoInput = {
  contaId: number
  tipo: 'credito' | 'debito'
  valor: number
  descricao?: string
}

export default class ContaService {
  constructor(private contaRepo = new ContaRepository()) {}

  async depositar(user: User, input: DepositoSaqueInput) {
    const conta = await this.getContaDoCliente(user)
    return this.aplicar(conta, 'deposito', 'entrada', input.valor, input.descricao)
  }

  async sacar(user: User, input: DepositoSaqueInput) {
    const conta = await this.getContaDoCliente(user)
    if (conta.saldo < input.valor) {
      throw new Exception('Saldo insuficiente para saque.', { status: 400 })
    }
    return this.aplicar(conta, 'saque', 'saida', input.valor, input.descricao)
  }

  async ajustarSaldo(input: AjusteSaldoInput) {
    const conta = await this.contaRepo.findById(input.contaId)
    if (!conta) throw new Exception('Conta nao encontrada.', { status: 404 })

    if (input.tipo === 'debito' && conta.saldo < input.valor) {
      throw new Exception('Saldo insuficiente para debito.', { status: 400 })
    }

    const tipoMov: TipoMovimentacao = input.tipo === 'credito' ? 'ajuste_credito' : 'ajuste_debito'
    const sentido = input.tipo === 'credito' ? 'entrada' : 'saida'
    return this.aplicar(conta, tipoMov, sentido, input.valor, input.descricao)
  }

  private async getContaDoCliente(user: User) {
    const cliente = await user.related('cliente').query().preload('conta').first()
    const conta = cliente?.conta
    if (!conta) {
      throw new Exception('Voce nao possui conta corrente.', { status: 400 })
    }
    return conta
  }

  private async aplicar(
    conta: any,
    tipo: TipoMovimentacao,
    sentido: 'entrada' | 'saida',
    valor: number,
    descricao?: string
  ) {
    return db.transaction(async (trx) => {
      conta.useTransaction(trx)
      conta.saldo = sentido === 'entrada' ? Number(conta.saldo) + valor : Number(conta.saldo) - valor
      await conta.save()

      const mov = await Movimentacao.create(
        {
          contaId: conta.id,
          tipo,
          sentido,
          valor,
          descricao: descricao ?? null,
        },
        { client: trx }
      )
      return { conta, movimentacao: mov }
    })
  }
}
