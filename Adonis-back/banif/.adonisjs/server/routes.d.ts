import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'cliente.index': { paramsTuple?: []; params?: {} }
    'cliente.create': { paramsTuple?: []; params?: {} }
    'cliente.store': { paramsTuple?: []; params?: {} }
    'cliente.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cliente.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cliente.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cliente.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'cliente.store': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'cliente.index': { paramsTuple?: []; params?: {} }
    'cliente.create': { paramsTuple?: []; params?: {} }
    'cliente.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cliente.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'cliente.index': { paramsTuple?: []; params?: {} }
    'cliente.create': { paramsTuple?: []; params?: {} }
    'cliente.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cliente.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'cliente.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'cliente.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'cliente.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}