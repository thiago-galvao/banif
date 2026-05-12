import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Cliente from '#models/cliente'
import Conta from '#models/conta'

export default class extends BaseSeeder {
  async run() {
    const user = await User.updateOrCreate(
      { email: 'thiago@hotmail.com' },
      {
        fullName: 'Thiago Cliente',
        email: 'thiago@hotmail.com',
        password: '123456',
        role: 'cliente',
      }
    )

    const cliente = await Cliente.updateOrCreate(
      { userId: user.id },
      {
        userId: user.id,
        cpf: '12345678901',
        cidade: 'Paranagua',
        estado: 'PR',
        rua: 'Rua Antonio Carlos Rodrigues',
        numero: '453',
      }
    )

    await Conta.updateOrCreate(
      { clienteId: cliente.id },
      {
        clienteId: cliente.id,
        agencia: '0001',
        numero: '10001-1',
        saldo: 1500.5,
      }
    )
  }
}
