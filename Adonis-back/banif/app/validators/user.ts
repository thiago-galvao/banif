import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(6).maxLength(64)

export const loginValidator = vine.compile(
  vine.object({
    email: email(),
    password: vine.string(),
  })
)

export const signupValidator = vine.compile(
  vine.object({
    fullName: vine.string().nullable(),
    email: email().unique(async (db, value) => {
      const exists = await db.from('users').where('email', value).first()
      return !exists
    }),
    password: password(),
    passwordConfirmation: password().sameAs('password'),
  })
)
