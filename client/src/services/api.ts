import {
  User,
  PoojaCategory,
  PoojaItem,
  GalleryImage,
  PoojaDetailsFormData,
  PoojaRequestRecord,
  WebsiteSettings,
} from '../types/index.js';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('pooja_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async login(credentials: { email: string; password: string }) {
    return request<{ message: string; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(details: { name: string; email: string; password: string }) {
    return request<{ message: string; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(details),
    });
  },

  async getMe() {
    return request<{ user: User }>('/auth/me');
  },

  async logout() {
    return request<{ message: string }>('/auth/logout', { method: 'POST' });
  },

  // Categories
  async getCategories() {
    return request<PoojaCategory[]>('/categories');
  },

  async createCategory(cat: { nameEnglish: string; nameKannada: string }) {
    return request<PoojaCategory>('/categories', {
      method: 'POST',
      body: JSON.stringify(cat),
    });
  },

  async updateCategory(id: string, cat: Partial<PoojaCategory>) {
    return request<PoojaCategory>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cat),
    });
  },

  async deleteCategory(id: string) {
    return request<{ message: string }>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Pooja Items
  async getPoojaItems(params?: { categoryId?: string; q?: string }) {
    const query = new URLSearchParams();
    if (params?.categoryId) query.append('categoryId', params.categoryId);
    if (params?.q) query.append('q', params.q);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<PoojaItem[]>(`/pooja-items${queryString}`);
  },

  async createPoojaItem(item: {
    nameEnglish: string;
    nameKannada: string;
    categoryId: string;
    defaultQuantity?: string;
  }) {
    return request<PoojaItem>('/pooja-items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  async updatePoojaItem(id: string, item: Partial<PoojaItem>) {
    return request<PoojaItem>(`/pooja-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  },

  async deletePoojaItem(id: string) {
    return request<{ message: string }>(`/pooja-items/${id}`, {
      method: 'DELETE',
    });
  },

  // Gallery
  async getGallery(category?: string) {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return request<GalleryImage[]>(`/gallery${query}`);
  },

  async createGalleryImage(data: {
    imageUrl: string;
    captionEnglish: string;
    captionKannada: string;
    category: string;
    sortOrder?: number;
  }) {
    return request<GalleryImage>('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async uploadGalleryFile(formData: FormData) {
    const token = localStorage.getItem('pooja_token');
    const response = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');
    return data as GalleryImage;
  },

  async deleteGalleryImage(id: string) {
    return request<{ message: string }>(`/gallery/${id}`, {
      method: 'DELETE',
    });
  },

  // Pooja Requests (PDF recordings)
  async savePoojaRequest(payload: PoojaDetailsFormData & {
    items: Array<{ poojaItemId?: string | null; nameEnglish: string; nameKannada: string; quantity?: string | null }>;
  }) {
    return request<PoojaRequestRecord>('/pooja-requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getPoojaRequests() {
    return request<PoojaRequestRecord[]>('/pooja-requests');
  },

  // Settings
  async getSettings() {
    return request<WebsiteSettings>('/settings');
  },

  async updateSettings(settings: WebsiteSettings) {
    return request<{ message: string }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

