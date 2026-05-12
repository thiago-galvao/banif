import vine from '@vinejs/vine'

export const aplicarValidator = vine.compile(
  vine.object({
    tipo: vine.enum(['poupanca', 'titulos', 'acoes']),
    valor: vine.number().positive(),
  })
)

export const resgatarValidator = vine.compile(
  vine.object({
    tipo: vine.enum(['poupanca', 'titulos', 'acoes']),
    valor: vine.number().positive(),
  })
)
