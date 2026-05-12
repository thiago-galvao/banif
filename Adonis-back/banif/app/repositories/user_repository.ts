import User from '#models/user'

export default class UserRepository {
  async findById(id: number) {
    return User.find(id)
  }

  async findByEmail(email: string) {
    return User.findBy('email', email)
  }

  async create(data: Partial<User>) {
    return User.create(data)
  }
}
