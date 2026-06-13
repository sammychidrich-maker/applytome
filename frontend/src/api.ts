import type { User, FormType, Question, ResponseType } from './types';

const API_BASE = '';

function getToken() {
  return localStorage.getItem('token');
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    fetchApi<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  login: (data: { email: string; password: string }) =>
    fetchApi<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  me: () => fetchApi<User>('/api/auth/me'),
};

export const formApi = {
  create: (data: { title: string; category: string; description?: string }) =>
    fetchApi<FormType>('/api/forms', { method: 'POST', body: JSON.stringify(data) }),
  list: () => fetchApi<FormType[]>('/api/forms'),
  get: (id: string) => fetchApi<FormType>(`/api/forms/${id}`),
  update: (id: string, data: Partial<FormType>) =>
    fetchApi<FormType>(`/api/forms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi<{ success: boolean }>(`/api/forms/${id}`, { method: 'DELETE' }),
  getBySlug: (slug: string) => fetchApi<FormType>(`/api/forms/s/${slug}`),
};

export const questionApi = {
  create: (formId: string, data: { type: string; label: string; placeholder?: string; required?: boolean; options?: string }) =>
    fetchApi<Question>(`/api/forms/${formId}/questions`, { method: 'POST', body: JSON.stringify(data) }),
  update: (formId: string, questionId: string, data: Partial<Question>) =>
    fetchApi<Question>(`/api/forms/${formId}/questions/${questionId}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (formId: string, questionId: string) =>
    fetchApi<{ success: boolean }>(`/api/forms/${formId}/questions/${questionId}`, { method: 'DELETE' }),
  reorder: (formId: string, questionIds: string[]) =>
    fetchApi<{ success: boolean }>(`/api/forms/${formId}/questions/reorder`, { method: 'PUT', body: JSON.stringify({ questionIds }) }),
};

export const responseApi = {
  submit: (slug: string, data: { applicantName: string; applicantEmail: string; answers: Record<string, string> }) =>
    fetchApi<{ success: boolean; responseId: string }>(`/api/forms/s/${slug}/responses`, { method: 'POST', body: JSON.stringify(data) }),
  list: (formId: string) => fetchApi<ResponseType[]>(`/api/forms/${formId}/responses`),
  get: (id: string) => fetchApi<ResponseType>(`/api/responses/${id}`),
  updateStatus: (id: string, status: string) =>
    fetchApi<ResponseType>(`/api/responses/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  delete: (id: string) => fetchApi<{ success: boolean }>(`/api/responses/${id}`, { method: 'DELETE' }),
};

export const uploadApi = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers: { ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) },
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json() as Promise<{ url: string }>;
  },
};
