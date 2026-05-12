import User from '#models/user'

export default class PerfilService {
  async build(user: User) {
    if (user.role === 'gerente') {
      return {
        regra: 'gerente',
        email: user.email,
        nome: user.fullName,
      }
    }

    const cliente = await user.related('cliente').query().preload('conta').first()
    const conta = cliente?.conta

    return {
      regra: 'cliente',
      email: user.email,
      nome: user.fullName,
      conta: conta
        ? {
            agencia: conta.agencia,
            numero: conta.numero,
            saldo: conta.saldo,
          }
        : null,
    }
  }
}
