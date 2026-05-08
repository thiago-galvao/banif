/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'cliente.index': {
    methods: ["GET","HEAD"],
    pattern: '/cliente',
    tokens: [{"old":"/cliente","type":0,"val":"cliente","end":""}],
    types: placeholder as Registry['cliente.index']['types'],
  },
  'cliente.create': {
    methods: ["GET","HEAD"],
    pattern: '/cliente/create',
    tokens: [{"old":"/cliente/create","type":0,"val":"cliente","end":""},{"old":"/cliente/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['cliente.create']['types'],
  },
  'cliente.store': {
    methods: ["POST"],
    pattern: '/cliente',
    tokens: [{"old":"/cliente","type":0,"val":"cliente","end":""}],
    types: placeholder as Registry['cliente.store']['types'],
  },
  'cliente.show': {
    methods: ["GET","HEAD"],
    pattern: '/cliente/:id',
    tokens: [{"old":"/cliente/:id","type":0,"val":"cliente","end":""},{"old":"/cliente/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['cliente.show']['types'],
  },
  'cliente.edit': {
    methods: ["GET","HEAD"],
    pattern: '/cliente/:id/edit',
    tokens: [{"old":"/cliente/:id/edit","type":0,"val":"cliente","end":""},{"old":"/cliente/:id/edit","type":1,"val":"id","end":""},{"old":"/cliente/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['cliente.edit']['types'],
  },
  'cliente.update': {
    methods: ["PUT","PATCH"],
    pattern: '/cliente/:id',
    tokens: [{"old":"/cliente/:id","type":0,"val":"cliente","end":""},{"old":"/cliente/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['cliente.update']['types'],
  },
  'cliente.destroy': {
    methods: ["DELETE"],
    pattern: '/cliente/:id',
    tokens: [{"old":"/cliente/:id","type":0,"val":"cliente","end":""},{"old":"/cliente/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['cliente.destroy']['types'],
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
