import db from '@adonisjs/lucid/services/db'
import { Exception } from '@adonisjs/core/exceptions'
import User from '#models/user'
import Movimentacao from '#models/movimentacao'
import Aplicacao, { type TipoAplicacao } from '#models/aplicacao'
import AplicacaoRepository from '#repositories/aplicacao_repository'

type AplicarInput = {
  tipo: TipoAplicacao
  valor: number
}

export default class AplicacaoService {
  constructor(private aplicacaoRepo = new AplicacaoRepository()) {}

  private async getContaDoCliente(user: User) {
    const cliente = await user.related('cliente').query().preload('conta').first()
    const conta = cliente?.conta
    if (!conta) {
      throw new Exception('Cliente nao possui conta corrente.', { status: 400 })
    }
    return conta
  }

  async listar(user: User) {
    const conta = await this.getContaDoCliente(user)
    const lista = await this.aplicacaoRepo.listByConta(conta.id)

    const tipos: TipoAplicacao[] = ['poupanca', 'titulos', 'acoes']
    return tipos.map((tipo) => {
      const found = lista.find((a) => a.tipo === tipo)
      return {
        tipo,
        valorAplicado: found ? Number(found.valorAplicado) : 0,
      }
    })
  }

  async aplicar(user: User, input: AplicarInput) {
    const conta = await this.getContaDoCliente(user)
    if (conta.saldo < input.valor) {
      throw new Exception('Saldo insuficiente para realizar a aplicacao.', { status: 400 })
    }

    return db.transaction(async (trx) => {
      conta.useTransaction(trx)
      const aplicacao = await Aplicacao.firstOrCreate(
        { contaId: conta.id, tipo: input.tipo },
        { contaId: conta.id, tipo: input.tipo, valorAplicado: 0 },
        { client: trx }
      )

      conta.saldo = Number(conta.saldo) - input.valor
      await conta.save()

      aplicacao.valorAplicado = Number(aplicacao.valorAplicado) + input.valor
      await aplicacao.save()

      await Movimentacao.create(
        {
          contaId: conta.id,
          tipo: 'aplicacao_investida',
          sentido: 'saida',
          valor: input.valor,
          descricao: `Aplicacao em ${input.tipo}`,
        },
        { client: trx }
      )

      return {
        tipo: input.tipo,
        valorAplicado: Number(aplicacao.valorAplicado),
        saldoAtual: Number(conta.saldo),
      }
    })
  }

  async resgatar(user: User, input: AplicarInput) {
    const conta = await this.getContaDoCliente(user)
    const aplicacao = await this.aplicacaoRepo.findByContaAndTipo(conta.id, input.tipo)
    if (!aplicacao || Number(aplicacao.valorAplicado) < input.valor) {
      throw new Exception('Valor aplicado insuficiente para resgatar.', { status: 400 })
    }

    return db.transaction(async (trx) => {
      conta.useTransaction(trx)
      aplicacao.useTransaction(trx)

      aplicacao.valorAplicado = Number(aplicacao.valorAplicado) - input.valor
      await aplicacao.save()

      conta.saldo = Number(conta.saldo) + input.valor
      await conta.save()

      await Movimentacao.create(
        {
          contaId: conta.id,
          tipo: 'aplicacao_resgatada',
          sentido: 'entrada',
          valor: input.valor,
          descricao: `Resgate de ${input.tipo}`,
        },
        { client: trx }
      )

      return {
        tipo: input.tipo,
        valorAplicado: Number(aplicacao.valorAplicado),
        saldoAtual: Number(conta.saldo),
      }
    })
  }
}
