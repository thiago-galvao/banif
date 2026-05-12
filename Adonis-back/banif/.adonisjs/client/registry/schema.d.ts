/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'access_tokens.store': {
    methods: ["POST"]
    pattern: '/api/v1/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'access_tokens.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
    }
  }
  'profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/perfil'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'clientes.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/gerente/clientes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/clientes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/clientes_controller').default['index']>>>
    }
  }
  'clientes.store': {
    methods: ["POST"]
    pattern: '/api/v1/gerente/cadastrar-cliente'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/cliente').cadastrarClienteValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/cliente').cadastrarClienteValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/clientes_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/clientes_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'contas.ajustar_saldo': {
    methods: ["POST"]
    pattern: '/api/v1/gerente/ajustar-saldo'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/conta').ajusteSaldoValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/conta').ajusteSaldoValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contas_controller').default['ajustarSaldo']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contas_controller').default['ajustarSaldo']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'pix.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/cliente/transf-pix'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pix_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pix_controller').default['show']>>>
    }
  }
  'pix.store': {
    methods: ["POST"]
    pattern: '/api/v1/cliente/transf-pix'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/pix').transferenciaPixValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/pix').transferenciaPixValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pix_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pix_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'extrato.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/cliente/extrato-transacoes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/extrato_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/extrato_controller').default['index']>>>
    }
  }
  'aplicacao.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/cliente/aplicacoes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/aplicacao_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/aplicacao_controller').default['index']>>>
    }
  }
  'aplicacao.aplicar': {
    methods: ["POST"]
    pattern: '/api/v1/cliente/aplicar'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/aplicacao').aplicarValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/aplicacao').aplicarValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/aplicacao_controller').default['aplicar']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/aplicacao_controller').default['aplicar']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'aplicacao.resgatar': {
    methods: ["POST"]
    pattern: '/api/v1/cliente/resgatar'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/aplicacao').resgatarValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/aplicacao').resgatarValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/aplicacao_controller').default['resgatar']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/aplicacao_controller').default['resgatar']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'contas.depositar': {
    methods: ["POST"]
    pattern: '/api/v1/cliente/depositar'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/conta').depositoSaqueValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/conta').depositoSaqueValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contas_controller').default['depositar']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contas_controller').default['depositar']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'contas.sacar': {
    methods: ["POST"]
    pattern: '/api/v1/cliente/sacar'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/conta').depositoSaqueValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/conta').depositoSaqueValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contas_controller').default['sacar']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contas_controller').default['sacar']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
