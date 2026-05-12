import Movimentacao from '#models/movimentacao'

export default class MovimentacaoRepository {
  async create(data: Partial<Movimentacao>) {
    return Movimentacao.create(data)
  }

  async listByConta(contaId: number) {
    return Movimentacao.query().where('conta_id', contaId).orderBy('created_at', 'desc')
  }
}
