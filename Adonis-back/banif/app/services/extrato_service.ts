import { Exception } from '@adonisjs/core/exceptions'
import User from '#models/user'
import MovimentacaoRepository from '#repositories/movimentacao_repository'

export default class ExtratoService {
  constructor(private movRepo = new MovimentacaoRepository()) {}

  async gerar(user: User) {
    const cliente = await user.related('cliente').query().preload('conta').first()
    const conta = cliente?.conta
    if (!conta) {
      throw new Exception('Cliente nao possui conta corrente.', { status: 400 })
    }

    const movs = await this.movRepo.listByConta(conta.id)

    return movs.map((m) => ({
      id: m.id,
      tipo: m.tipo,
      sentido: m.sentido,
      valor: m.sentido === 'entrada' ? `+${m.valor.toFixed(2)}` : `-${m.valor.toFixed(2)}`,
      valorNumerico: m.valor,
      descricao: m.descricao,
      data: m.createdAt?.toISO(),
    }))
  }
}
