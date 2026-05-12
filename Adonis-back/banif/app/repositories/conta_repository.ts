import Conta from '#models/conta'

export default class ContaRepository {
  async findById(id: number) {
    return Conta.find(id)
  }

  async findByClienteId(clienteId: number) {
    return Conta.findBy('cliente_id', clienteId)
  }

  async findByNumero(numero: string) {
    return Conta.findBy('numero', numero)
  }

  async create(data: Partial<Conta>) {
    return Conta.create(data)
  }

  async count() {
    const result = await Conta.query().count('* as total')
    return Number(result[0].$extras.total)
  }
}
