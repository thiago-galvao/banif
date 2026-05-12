import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany('email', [
      {
        fullName: 'Gerente BANIF',
        email: 'gerente@banif.com',
        password: '123456',
        role: 'gerente',
      },
    ])
  }
}
