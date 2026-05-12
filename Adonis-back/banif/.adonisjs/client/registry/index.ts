/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/login',
    tokens: [{"old":"/api/v1/login","type":0,"val":"api","end":""},{"old":"/api/v1/login","type":0,"val":"v1","end":""},{"old":"/api/v1/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['access_tokens.store']['types'],
  },
  'access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/logout',
    tokens: [{"old":"/api/v1/logout","type":0,"val":"api","end":""},{"old":"/api/v1/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['access_tokens.destroy']['types'],
  },
  'profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/perfil',
    tokens: [{"old":"/api/v1/perfil","type":0,"val":"api","end":""},{"old":"/api/v1/perfil","type":0,"val":"v1","end":""},{"old":"/api/v1/perfil","type":0,"val":"perfil","end":""}],
    types: placeholder as Registry['profile.show']['types'],
  },
  'clientes.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/gerente/clientes',
    tokens: [{"old":"/api/v1/gerente/clientes","type":0,"val":"api","end":""},{"old":"/api/v1/gerente/clientes","type":0,"val":"v1","end":""},{"old":"/api/v1/gerente/clientes","type":0,"val":"gerente","end":""},{"old":"/api/v1/gerente/clientes","type":0,"val":"clientes","end":""}],
    types: placeholder as Registry['clientes.index']['types'],
  },
  'clientes.store': {
    methods: ["POST"],
    pattern: '/api/v1/gerente/cadastrar-cliente',
    tokens: [{"old":"/api/v1/gerente/cadastrar-cliente","type":0,"val":"api","end":""},{"old":"/api/v1/gerente/cadastrar-cliente","type":0,"val":"v1","end":""},{"old":"/api/v1/gerente/cadastrar-cliente","type":0,"val":"gerente","end":""},{"old":"/api/v1/gerente/cadastrar-cliente","type":0,"val":"cadastrar-cliente","end":""}],
    types: placeholder as Registry['clientes.store']['types'],
  },
  'contas.ajustar_saldo': {
    methods: ["POST"],
    pattern: '/api/v1/gerente/ajustar-saldo',
    tokens: [{"old":"/api/v1/gerente/ajustar-saldo","type":0,"val":"api","end":""},{"old":"/api/v1/gerente/ajustar-saldo","type":0,"val":"v1","end":""},{"old":"/api/v1/gerente/ajustar-saldo","type":0,"val":"gerente","end":""},{"old":"/api/v1/gerente/ajustar-saldo","type":0,"val":"ajustar-saldo","end":""}],
    types: placeholder as Registry['contas.ajustar_saldo']['types'],
  },
  'pix.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/cliente/transf-pix',
    tokens: [{"old":"/api/v1/cliente/transf-pix","type":0,"val":"api","end":""},{"old":"/api/v1/cliente/transf-pix","type":0,"val":"v1","end":""},{"old":"/api/v1/cliente/transf-pix","type":0,"val":"cliente","end":""},{"old":"/api/v1/cliente/transf-pix","type":0,"val":"transf-pix","end":""}],
    types: placeholder as Registry['pix.show']['types'],
  },
  'pix.store': {
    methods: ["POST"],
    pattern: '/api/v1/cliente/transf-pix',
    tokens: [{"old":"/api/v1/cliente/transf-pix","type":0,"val":"api","end":""},{"old":"/api/v1/cliente/transf-pix","type":0,"val":"v1","end":""},{"old":"/api/v1/cliente/transf-pix","type":0,"val":"cliente","end":""},{"old":"/api/v1/cliente/transf-pix","type":0,"val":"transf-pix","end":""}],
    types: placeholder as Registry['pix.store']['types'],
  },
  'extrato.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/cliente/extrato-transacoes',
    tokens: [{"old":"/api/v1/cliente/extrato-transacoes","type":0,"val":"api","end":""},{"old":"/api/v1/cliente/extrato-transacoes","type":0,"val":"v1","end":""},{"old":"/api/v1/cliente/extrato-transacoes","type":0,"val":"cliente","end":""},{"old":"/api/v1/cliente/extrato-transacoes","type":0,"val":"extrato-transacoes","end":""}],
    types: placeholder as Registry['extrato.index']['types'],
  },
  'aplicacao.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/cliente/aplicacoes',
    tokens: [{"old":"/api/v1/cliente/aplicacoes","type":0,"val":"api","end":""},{"old":"/api/v1/cliente/aplicacoes","type":0,"val":"v1","end":""},{"old":"/api/v1/cliente/aplicacoes","type":0,"val":"cliente","end":""},{"old":"/api/v1/cliente/aplicacoes","type":0,"val":"aplicacoes","end":""}],
    types: placeholder as Registry['aplicacao.index']['types'],
  },
  'aplicacao.aplicar': {
    methods: ["POST"],
    pattern: '/api/v1/cliente/aplicar',
    tokens: [{"old":"/api/v1/cliente/aplicar","type":0,"val":"api","end":""},{"old":"/api/v1/cliente/aplicar","type":0,"val":"v1","end":""},{"old":"/api/v1/cliente/aplicar","type":0,"val":"cliente","end":""},{"old":"/api/v1/cliente/aplicar","type":0,"val":"aplicar","end":""}],
    types: placeholder as Registry['aplicacao.aplicar']['types'],
  },
  'aplicacao.resgatar': {
    methods: ["POST"],
    pattern: '/api/v1/cliente/resgatar',
    tokens: [{"old":"/api/v1/cliente/resgatar","type":0,"val":"api","end":""},{"old":"/api/v1/cliente/resgatar","type":0,"val":"v1","end":""},{"old":"/api/v1/cliente/resgatar","type":0,"val":"cliente","end":""},{"old":"/api/v1/cliente/resgatar","type":0,"val":"resgatar","end":""}],
    types: placeholder as Registry['aplicacao.resgatar']['types'],
  },
  'contas.depositar': {
    methods: ["POST"],
    pattern: '/api/v1/cliente/depositar',
    tokens: [{"old":"/api/v1/cliente/depositar","type":0,"val":"api","end":""},{"old":"/api/v1/cliente/depositar","type":0,"val":"v1","end":""},{"old":"/api/v1/cliente/depositar","type":0,"val":"cliente","end":""},{"old":"/api/v1/cliente/depositar","type":0,"val":"depositar","end":""}],
    types: placeholder as Registry['contas.depositar']['types'],
  },
  'contas.sacar': {
    methods: ["POST"],
    pattern: '/api/v1/cliente/sacar',
    tokens: [{"old":"/api/v1/cliente/sacar","type":0,"val":"api","end":""},{"old":"/api/v1/cliente/sacar","type":0,"val":"v1","end":""},{"old":"/api/v1/cliente/sacar","type":0,"val":"cliente","end":""},{"old":"/api/v1/cliente/sacar","type":0,"val":"sacar","end":""}],
    types: placeholder as Registry['contas.sacar']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
