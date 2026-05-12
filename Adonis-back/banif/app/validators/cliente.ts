import vine from '@vinejs/vine'

export const cadastrarClienteValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3).maxLength(120),
    email: vine
      .string()
      .email()
      .maxLength(254)
      .unique(async (db, value) => {
        const exists = await db.from('users').where('email', value).first()
        return !exists
      }),
    password: vine.string().minLength(6).maxLength(64),
    cpf: vine
      .string()
      .regex(/^\d{11}$/)
      .unique(async (db, value) => {
        const exists = await db.from('clientes').where('cpf', value).first()
        return !exists
      }),
    cidade: vine.string().trim().minLength(2).maxLength(80),
    estado: vine.string().trim().fixedLength(2),
    rua: vine.string().trim().minLength(2).maxLength(120),
    numero: vine.string().trim().minLength(1).maxLength(20),
  })
)
