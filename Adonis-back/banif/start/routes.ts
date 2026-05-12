import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'
import { middleware } from '#start/kernel'

const AccessTokensController = () => import('#controllers/access_tokens_controller')
const ProfileController = () => import('#controllers/profile_controller')
const ClientesController = () => import('#controllers/clientes_controller')
const ContasController = () => import('#controllers/contas_controller')
const PixController = () => import('#controllers/pix_controller')
const ExtratoController = () => import('#controllers/extrato_controller')
const AplicacaoController = () => import('#controllers/aplicacao_controller')

router.get('/', async () => ({ status: 'ok', api: 'banif', version: 'v1' }))

router.get('/test-db', async ({ response }) => {
  try {
    const resultado = await db.rawQuery('SELECT 1 + 1 as result')
    return response.ok({ status: 'Conectado!', data: resultado[0] })
  } catch (error: any) {
    return response.internalServerError({
      status: 'Erro de conexao',
      message: error?.message,
    })
  }
})

router
  .group(() => {
    router.post('/login', [AccessTokensController, 'store'])

    router
      .group(() => {
        router.post('/logout', [AccessTokensController, 'destroy'])
        router.get('/perfil', [ProfileController, 'show'])

        router
          .group(() => {
            router.get('/clientes', [ClientesController, 'index'])
            router.post('/cadastrar-cliente', [ClientesController, 'store'])
            router.post('/ajustar-saldo', [ContasController, 'ajustarSaldo'])
          })
          .prefix('/gerente')
          .use(middleware.authorize({ roles: ['gerente'] }))

        router
          .group(() => {
            router.get('/transf-pix', [PixController, 'show'])
            router.post('/transf-pix', [PixController, 'store'])
            router.get('/extrato-transacoes', [ExtratoController, 'index'])
            router.get('/aplicacoes', [AplicacaoController, 'index'])
            router.post('/aplicar', [AplicacaoController, 'aplicar'])
            router.post('/resgatar', [AplicacaoController, 'resgatar'])
            router.post('/depositar', [ContasController, 'depositar'])
            router.post('/sacar', [ContasController, 'sacar'])
          })
          .prefix('/cliente')
          .use(middleware.authorize({ roles: ['cliente'] }))
      })
      .use(middleware.auth())
  })
  .prefix('/api/v1')
