import { API_BASE_URL, APP_CODE } from '../config/env'
import { useGlobalLoading } from '../componables/useGlobalLoading'

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

type RequestOptions = {
  method?: RequestMethod
  body?: unknown
  headers?: Record<string, string>
  skipLoading?: boolean
}

function buildUrl(path: string) {
  return `${API_BASE_URL}${path}`
}

function buildHeaders(body?: unknown, customHeaders?: Record<string, string>) {
  const baseHeaders: Record<string, string> = {
    'x-app-code': APP_CODE,
    ...(customHeaders || {})
  }

  if (!(body instanceof FormData)) {
    baseHeaders['Content-Type'] = 'application/json'
  }

  return baseHeaders
}

function buildBody(body?: unknown) {
  if (body === undefined) return undefined
  if (body instanceof FormData) return body
  return JSON.stringify(body)
}

export async function httpRequest<T = any>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { startLoading, endLoading } = useGlobalLoading()

  if (!options.skipLoading) {
    startLoading()
  }

  try {
    const response = await fetch(buildUrl(path), {
      method: options.method || 'GET',
      headers: buildHeaders(options.body, options.headers),
      body: buildBody(options.body)
    })

    const result = await response.json()

    if (!response.ok || result.code !== 0) {
      throw new Error(result.message || 'Request failed')
    }

    return result
  } finally {
    if (!options.skipLoading) {
      endLoading()
    }
  }
}