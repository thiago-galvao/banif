/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  cliente: {
    index: typeof routes['cliente.index']
    create: typeof routes['cliente.create']
    store: typeof routes['cliente.store']
    show: typeof routes['cliente.show']
    edit: typeof routes['cliente.edit']
    update: typeof routes['cliente.update']
    destroy: typeof routes['cliente.destroy']
  }
}
