import nodemailer, { type Transporter } from 'nodemailer'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

type SendInput = {
  to: string
  subject: string
  text: string
  html?: string
}

export default class MailService {
  private transporter: Transporter | null = null

  private getTransporter(): Transporter | null {
    if (this.transporter) return this.transporter

    const driver = env.get('MAIL_DRIVER') ?? 'log'
    if (driver !== 'smtp') return null

    this.transporter = nodemailer.createTransport({
      host: env.get('MAIL_HOST'),
      port: env.get('MAIL_PORT') ?? 587,
      secure: false,
      auth: env.get('MAIL_USER')
        ? {
            user: env.get('MAIL_USER'),
            pass: env.get('MAIL_PASSWORD'),
          }
        : undefined,
    })
    return this.transporter
  }

  async send(input: SendInput) {
    const transporter = this.getTransporter()
    const from = env.get('MAIL_FROM') ?? 'no-reply@banif.com'

    if (!transporter) {
      logger.info(
        '\n==================== EMAIL (modo log) ====================\n' +
          `De:      ${from}\n` +
          `Para:    ${input.to}\n` +
          `Assunto: ${input.subject}\n` +
          `Corpo:\n${input.text}\n` +
          '==========================================================\n'
      )
      return
    }

    await transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    })
  }

  async enviarBoasVindasCliente(input: {
    nome: string
    email: string
    senha: string
    agencia: string
    numero: string
  }) {
    const corpo = [
      `Ola ${input.nome},`,
      '',
      'Sua conta no BANIF foi criada com sucesso!',
      '',
      'Use as credenciais abaixo para acessar o app:',
      `  E-mail: ${input.email}`,
      `  Senha:  ${input.senha}`,
      '',
      'Sua conta corrente:',
      `  Agencia: ${input.agencia}`,
      `  Numero:  ${input.numero}`,
      '',
      'Atenciosamente,',
      'Equipe BANIF',
    ].join('\n')

    await this.send({
      to: input.email,
      subject: 'Bem-vindo ao BANIF — suas credenciais de acesso',
      text: corpo,
    })
  }
}
