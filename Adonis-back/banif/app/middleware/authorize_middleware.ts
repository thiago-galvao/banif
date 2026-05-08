import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

type AuthorizatonOptions = 
| { permissions: string[]} 
| { role: string}

export default class AuthorizeMiddleware {
  async handle({auth, response}: HttpContext, next: NextFn, options: AuthorizatonOptions ) {
    

    await next()
  }
}