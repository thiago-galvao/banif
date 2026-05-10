// ============================================================
// api.ts — Camada de serviço centralizada (segue contrato-api)
// Base URL configurável via variável de ambiente
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api/v1'

// ---------- helpers ----------

function getToken(): string | null {
  return localStorage.getItem('token')
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const token = getToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const json = await response.json()
  return json as T
}

// ---------- tipos que espelham o contrato ----------

export interface ApiSuccess<T> {
  status: 'success'
  message?: string
  data: T
}

export interface ApiError {
  status: 'error'
  message: string
  data: null
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// -- Login --
export interface LoginPayload {
  email: string
  senha: string
}

export interface LoginData {
  token: string
  user: { id: number; nome: string }
}

// -- Perfil --
export interface PerfilGerente {
  regra: 'gerente'
  email: string
}

export interface PerfilCliente {
  regra: 'cliente'
  email: string
  conta: { agencia: string; numero: string; saldo: number }
}

export type PerfilData = PerfilGerente | PerfilCliente

// -- Clientes (gerente) --
export interface ClienteConta {
  id: number
  saldo: number
  agencia: string
  numero: string
}

export interface Cliente {
  id: number
  nome: string
  email: string
  conta: ClienteConta
}

// -- Cadastrar cliente --
export interface CadastrarClientePayload {
  nome: string
  email: string
  senha: string
}

// -- Extrato --
export interface Transacao {
  valor: number
  tipo: 'credito' | 'debito'
  data: string
  conta: { usuario: { nome: string } }
}

export interface ExtratoData {
  transacoes: Transacao[]
}

// -- Poupança --
export interface PoupancaData {
  conta: {
    saldo: number
    tipo: 'poupanca'
    agencia: string
    numero: string
  }
}

export interface AplicarPoupancaPayload {
  valor: number
}

// -- Pix --
export interface PixSaldoData {
  email: string
  conta: { saldo: number }
}

export interface PixPayload {
  email: string
  valor: number
  tipo: 'pix'
  descricao?: string
}

export interface PixResultData {
  email: string
  valor: number
  tipo: 'pix'
  descricao?: string
}

// ============================================================
// Funções de API
// ============================================================

/** POST /login */
export function login(payload: LoginPayload) {
  return request<ApiResponse<LoginData>>('POST', '/login', { data: payload })
}

/** GET /perfil — requer token */
export function getPerfil() {
  return request<ApiResponse<PerfilData>>('GET', '/perfil')
}

/** GET /gerente/clientes — requer token de gerente */
export function getClientes() {
  return request<ApiResponse<Cliente[]>>('GET', '/gerente/clientes')
}

/** POST /gerente/cadastrar-cliente — requer token de gerente */
export function cadastrarCliente(payload: CadastrarClientePayload) {
  return request<ApiResponse<CadastrarClientePayload>>('POST', '/gerente/cadastrar-cliente', { data: payload })
}

/** GET /cliente/extrato-transacoes — requer token de cliente */
export function getExtrato() {
  return request<ApiResponse<ExtratoData>>('GET', '/cliente/extrato-transacoes')
}

/** GET /cliente/aplicar-poupanca — requer token de cliente */
export function getPoupanca() {
  return request<ApiResponse<PoupancaData>>('GET', '/cliente/aplicar-poupanca')
}

/** POST /cliente/aplicar-poupanca — requer token de cliente */
export function aplicarPoupanca(payload: AplicarPoupancaPayload) {
  return request<ApiResponse<PoupancaData>>('POST', '/cliente/aplicar-poupanca', payload)
}

/** GET /cliente/transf-pix — requer token de cliente */
export function getPixInfo() {
  return request<ApiResponse<PixSaldoData>>('GET', '/cliente/transf-pix')
}

/** POST /cliente/transf-pix — requer token de cliente */
export function enviarPix(payload: PixPayload) {
  return request<ApiResponse<PixResultData>>('POST', '/cliente/transf-pix', payload)
}