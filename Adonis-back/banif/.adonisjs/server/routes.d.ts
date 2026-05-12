import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'access_tokens.store': { paramsTuple?: []; params?: {} }
    'access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'clientes.index': { paramsTuple?: []; params?: {} }
    'clientes.store': { paramsTuple?: []; params?: {} }
    'contas.ajustar_saldo': { paramsTuple?: []; params?: {} }
    'pix.show': { paramsTuple?: []; params?: {} }
    'pix.store': { paramsTuple?: []; params?: {} }
    'extrato.index': { paramsTuple?: []; params?: {} }
    'aplicacao.index': { paramsTuple?: []; params?: {} }
    'aplicacao.aplicar': { paramsTuple?: []; params?: {} }
    'aplicacao.resgatar': { paramsTuple?: []; params?: {} }
    'contas.depositar': { paramsTuple?: []; params?: {} }
    'contas.sacar': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'profile.show': { paramsTuple?: []; params?: {} }
    'clientes.index': { paramsTuple?: []; params?: {} }
    'pix.show': { paramsTuple?: []; params?: {} }
    'extrato.index': { paramsTuple?: []; params?: {} }
    'aplicacao.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'profile.show': { paramsTuple?: []; params?: {} }
    'clientes.index': { paramsTuple?: []; params?: {} }
    'pix.show': { paramsTuple?: []; params?: {} }
    'extrato.index': { paramsTuple?: []; params?: {} }
    'aplicacao.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'access_tokens.store': { paramsTuple?: []; params?: {} }
    'access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'clientes.store': { paramsTuple?: []; params?: {} }
    'contas.ajustar_saldo': { paramsTuple?: []; params?: {} }
    'pix.store': { paramsTuple?: []; params?: {} }
    'aplicacao.aplicar': { paramsTuple?: []; params?: {} }
    'aplicacao.resgatar': { paramsTuple?: []; params?: {} }
    'contas.depositar': { paramsTuple?: []; params?: {} }
    'contas.sacar': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}