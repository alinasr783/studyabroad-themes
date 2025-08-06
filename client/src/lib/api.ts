// API client for server-side endpoints
const API_BASE_URL = '';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(response.status, error || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// Countries API
export const countriesApi = {
  getAll: (clientId?: string) =>
    apiRequest(`/api/countries${clientId ? `?client_id=${clientId}` : ''}`),
  getById: (id: string) => apiRequest(`/api/countries/${id}`),
  getBySlug: (slug: string, clientId?: string) =>
    apiRequest(`/api/countries/slug/${slug}${clientId ? `?client_id=${clientId}` : ''}`),
  create: (data: any) =>
    apiRequest('/api/countries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest(`/api/countries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/api/countries/${id}`, { method: 'DELETE' }),
};

// Universities API
export const universitiesApi = {
  getAll: (clientId?: string, countryId?: string) => {
    const params = new URLSearchParams();
    if (clientId) params.set('client_id', clientId);
    if (countryId) params.set('country_id', countryId);
    return apiRequest(`/api/universities?${params.toString()}`);
  },
  getById: (id: string) => apiRequest(`/api/universities/${id}`),
  getBySlug: (slug: string, clientId?: string) =>
    apiRequest(`/api/universities/slug/${slug}${clientId ? `?client_id=${clientId}` : ''}`),
  create: (data: any) =>
    apiRequest('/api/universities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest(`/api/universities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/api/universities/${id}`, { method: 'DELETE' }),
};

// Programs API
export const programsApi = {
  getAll: (clientId?: string, universityId?: string, countryId?: string) => {
    const params = new URLSearchParams();
    if (clientId) params.set('client_id', clientId);
    if (universityId) params.set('university_id', universityId);
    if (countryId) params.set('country_id', countryId);
    return apiRequest(`/api/programs?${params.toString()}`);
  },
  getById: (id: string) => apiRequest(`/api/programs/${id}`),
  getBySlug: (slug: string, clientId?: string) =>
    apiRequest(`/api/programs/slug/${slug}${clientId ? `?client_id=${clientId}` : ''}`),
  create: (data: any) =>
    apiRequest('/api/programs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest(`/api/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/api/programs/${id}`, { method: 'DELETE' }),
};

// Articles API
export const articlesApi = {
  getAll: (clientId?: string) =>
    apiRequest(`/api/articles${clientId ? `?client_id=${clientId}` : ''}`),
  getById: (id: string) => apiRequest(`/api/articles/${id}`),
  getBySlug: (slug: string, clientId?: string) =>
    apiRequest(`/api/articles/slug/${slug}${clientId ? `?client_id=${clientId}` : ''}`),
  create: (data: any) =>
    apiRequest('/api/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest(`/api/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/api/articles/${id}`, { method: 'DELETE' }),
};

// Consultations API
export const consultationsApi = {
  getAll: (clientId?: string) =>
    apiRequest(`/api/consultations${clientId ? `?client_id=${clientId}` : ''}`),
  getById: (id: string) => apiRequest(`/api/consultations/${id}`),
  create: (data: any) =>
    apiRequest('/api/consultations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest(`/api/consultations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Contact Messages API
export const contactMessagesApi = {
  getAll: (clientId?: string) =>
    apiRequest(`/api/contact-messages${clientId ? `?client_id=${clientId}` : ''}`),
  getById: (id: string) => apiRequest(`/api/contact-messages/${id}`),
  create: (data: any) =>
    apiRequest('/api/contact-messages', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest(`/api/contact-messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Testimonials API
export const testimonialsApi = {
  getAll: (clientId?: string) =>
    apiRequest(`/api/testimonials${clientId ? `?client_id=${clientId}` : ''}`),
  getById: (id: string) => apiRequest(`/api/testimonials/${id}`),
  create: (data: any) =>
    apiRequest('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest(`/api/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/api/testimonials/${id}`, { method: 'DELETE' }),
};

// Dashboard API
export const dashboardApi = {
  getStats: (clientId: string) =>
    apiRequest(`/api/dashboard/stats?client_id=${clientId}`),
};

// Site Settings API
export const siteSettingsApi = {
  get: (clientId: string) =>
    apiRequest(`/api/site-settings?client_id=${clientId}`),
  update: (clientId: string, data: any) =>
    apiRequest(`/api/site-settings?client_id=${clientId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export default apiRequest;