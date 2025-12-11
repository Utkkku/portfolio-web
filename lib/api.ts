// Centralized API client with error handling and type safety

interface ApiError {
  message: string
  status?: number
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_API_URL || ''
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        let error: ApiError
        try {
          const errorData = await response.json()
          error = {
            message: errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
            details: errorData.details,
          }
        } catch {
          error = {
            message: `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
          }
        }
        throw error
      }

      return response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw { message: error.message } as ApiError
      }
      throw error
    }
  }

  async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers })
  }

  async post<T>(endpoint: string, data: unknown, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    })
  }

  async put<T>(endpoint: string, data: unknown, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers,
    })
  }

  async delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers })
  }
}

export const apiClient = new ApiClient()

  // Type-safe API endpoints
export const api = {
  certificates: {
    getAll: <T = unknown>() => apiClient.get<T>('/api/certificates'),
    create: <T = unknown>(data: unknown, headers?: HeadersInit) => 
      apiClient.post<T>('/api/certificates', data, headers),
    update: <T = unknown>(data: unknown, headers?: HeadersInit) => 
      apiClient.put<T>('/api/certificates', data, headers),
    delete: <T = unknown>(id: number, headers?: HeadersInit) => 
      apiClient.delete<T>(`/api/certificates?id=${id}`, headers),
    upload: (formData: FormData, token: string) =>
      fetch('/api/certificates/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }).then((res) => res.json()),
  },
  projects: {
    getAll: <T = unknown>() => apiClient.get<T>('/api/projects'),
    create: <T = unknown>(data: unknown, headers?: HeadersInit) => 
      apiClient.post<T>('/api/projects', data, headers),
    update: <T = unknown>(data: unknown, headers?: HeadersInit) => 
      apiClient.put<T>('/api/projects', data, headers),
    delete: <T = unknown>(id: number, headers?: HeadersInit) => 
      apiClient.delete<T>(`/api/projects?id=${id}`, headers),
  },
  skills: {
    getAll: <T = unknown>() => apiClient.get<T>('/api/skills'),
    create: <T = unknown>(data: unknown, headers?: HeadersInit) => 
      apiClient.post<T>('/api/skills', data, headers),
    update: <T = unknown>(data: unknown, headers?: HeadersInit) => 
      apiClient.put<T>('/api/skills', data, headers),
    delete: <T = unknown>(id: number, headers?: HeadersInit) => 
      apiClient.delete<T>(`/api/skills?id=${id}`, headers),
  },
}

