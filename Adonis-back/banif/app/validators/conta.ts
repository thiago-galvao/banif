import vine from '@vinejs/vine'

export const depositoSaqueValidator = vine.compile(
  vine.object({
    valor: vine.number().positive(),
    descricao: vine.string().trim().maxLength(255).optional(),
  })
)

export const ajusteSaldoValidator = vine.compile(
  vine.object({
    contaId: vine.number().positive(),
    tipo: vine.enum(['credito', 'debito']),
    valor: vine.number().positive(),
    descricao: vine.string().trim().maxLength(255).optional(),
  })
)
