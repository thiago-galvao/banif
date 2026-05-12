/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  accessTokens: {
    store: typeof routes['access_tokens.store']
    destroy: typeof routes['access_tokens.destroy']
  }
  profile: {
    show: typeof routes['profile.show']
  }
  clientes: {
    index: typeof routes['clientes.index']
    store: typeof routes['clientes.store']
  }
  contas: {
    ajustarSaldo: typeof routes['contas.ajustar_saldo']
    depositar: typeof routes['contas.depositar']
    sacar: typeof routes['contas.sacar']
  }
  pix: {
    show: typeof routes['pix.show']
    store: typeof routes['pix.store']
  }
  extrato: {
    index: typeof routes['extrato.index']
  }
  aplicacao: {
    index: typeof routes['aplicacao.index']
    aplicar: typeof routes['aplicacao.aplicar']
    resgatar: typeof routes['aplicacao.resgatar']
  }
}
