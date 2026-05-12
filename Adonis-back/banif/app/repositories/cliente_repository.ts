import Cliente from '#models/cliente'

export default class ClienteRepository {
  async findById(id: number) {
    return Cliente.find(id)
  }

  async findByUserId(userId: number) {
    return Cliente.findBy('user_id', userId)
  }

  async listAllWithUserAndConta() {
    return Cliente.query().preload('user').preload('conta').orderBy('id', 'asc')
  }

  async create(data: Partial<Cliente>) {
    return Cliente.create(data)
  }
}
