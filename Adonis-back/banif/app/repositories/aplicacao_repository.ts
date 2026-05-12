import Aplicacao, { type TipoAplicacao } from '#models/aplicacao'

export default class AplicacaoRepository {
  async listByConta(contaId: number) {
    return Aplicacao.query().where('conta_id', contaId).orderBy('tipo', 'asc')
  }

  async findByContaAndTipo(contaId: number, tipo: TipoAplicacao) {
    return Aplicacao.query().where('conta_id', contaId).where('tipo', tipo).first()
  }

  async firstOrCreate(contaId: number, tipo: TipoAplicacao) {
    return Aplicacao.firstOrCreate(
      { contaId, tipo },
      { contaId, tipo, valorAplicado: 0 }
    )
  }
}
