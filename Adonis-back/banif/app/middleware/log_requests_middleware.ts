import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import string from '@adonisjs/core/helpers/string'

export default class LogRequestsMiddleware {
  async handle({response, request, logger}:HttpContext, next: NextFn) {
    const startTime = process.hrtime()

    await next()
    
    const endTime = process.hrtime(startTime)
    const responseStatus = response.getStatus()
    const uri = request.url()
    const method = request.method()
    
    logger.info(`${method} ${uri}: ${responseStatus} (${string.prettyHrTime(endTime)})`)
  }
}