import type { HttpContext } from '@adonisjs/core/http'
import Cliente from '#models/cliente'
export default class ClientesController {
  /**
   * Display a list of resource
   */
  async index({request}: HttpContext) {
    return 'hello world'
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['login', 'senha'])
    
    const post = await Cliente.create(data)
    
    return response.created(post)
  }

  /**
   * Show individual record
   */
  async show({ response }: HttpContext) {
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}