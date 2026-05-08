import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'

// mock para login
router.post('/login', async ({ response }) => {
  
  return response.ok({
    status: 'success',
    message: 'Login realizado com sucesso (MOCK)',
    data: {
      token: 'token_ficticio_para_teste_12345',
      user: {
        id: 1,
        login:  'usuario_teste',
        role: 'gerente'
      }
    }
  })
})

router.resource('cliente', controllers.Clientes)

router.get('/test-db', async ({ response }) => {
  try {
    // Executa uma consulta bruta simples para testar a conexão
    const resultado = await db.rawQuery('SELECT 1 + 1 as result')
    return response.ok({ 
      status: 'Conectado!', 
      data: resultado[0] 
    })
  } catch (error) {
    return response.internalServerError({ 
      status: 'Erro de conexão', 
      message: error.message 
    })
  }
})


