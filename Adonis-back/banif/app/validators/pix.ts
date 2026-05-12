import vine from '@vinejs/vine'

export const transferenciaPixValidator = vine.compile(
  vine.object({
    email: vine.string().email().maxLength(254),
    valor: vine.number().positive(),
    descricao: vine.string().trim().maxLength(255).optional(),
  })
)
