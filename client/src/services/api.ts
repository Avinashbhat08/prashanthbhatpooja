import {
  User,
  PoojaCategory,
  PoojaItem,
  GalleryImage,
  PoojaDetailsFormData,
  PoojaRequestRecord,
  WebsiteSettings,
  HoroscopeFormData,
  HoroscopeRequestRecord,
  DoshaItem,
  RemedyItem,
  NotificationRecord,
  VimshottariDashaResult,
  CurrentDashaHierarchy,
} from '../types/index.js';
import {
  fallbackCategories,
  fallbackGallery,
  fallbackPoojaItems,
  fallbackSettings,
} from './fallbackData.js';

// Centralized API Base URL configuration
function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!envUrl) {
    return '/api';
  }
  const cleanUrl = envUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
}

const API_BASE = getApiBaseUrl();

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('pooja_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getFallbackForEndpoint<T>(endpoint: string): T | undefined {
  const [basePath, searchParamsStr] = endpoint.split('?');
  const params = new URLSearchParams(searchParamsStr || '');

  if (basePath === '/gallery') {
    const category = params.get('category');
    if (category && category !== 'All') {
      if (category === 'Pooja Ceremonies') {
        const ceremonies = [
          'Pooja Ceremonies',
          'Sathyanarayana Pooja',
          'Sashtiapthapoorthi Shanti',
          'Grihapravesha',
          'Durga Namaskara',
        ];
        return fallbackGallery.filter((img) => ceremonies.includes(img.category)) as unknown as T;
      }
      return fallbackGallery.filter((img) => img.category === category) as unknown as T;
    }
    return fallbackGallery as unknown as T;
  }

  if (basePath.startsWith('/gallery/')) {
    const id = basePath.replace('/gallery/', '');
    const found = fallbackGallery.find((img) => img.id === id);
    if (found) return found as unknown as T;
  }

  if (basePath === '/categories') {
    return fallbackCategories as unknown as T;
  }

  if (basePath === '/pooja-items') {
    const categoryId = params.get('categoryId');
    const q = params.get('q')?.toLowerCase();
    let items = fallbackPoojaItems;
    if (categoryId) {
      items = items.filter((item) => item.categoryId === categoryId);
    }
    if (q) {
      items = items.filter(
        (item) =>
          item.nameEnglish.toLowerCase().includes(q) ||
          item.nameKannada.toLowerCase().includes(q)
      );
    }
    return items as unknown as T;
  }

  if (basePath === '/settings') {
    return fallbackSettings as unknown as T;
  }

  return undefined;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const method = options.method?.toUpperCase() || 'GET';

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = json.message || `Request failed with status ${response.status}`;
      // On 404 or server failure for GET requests, check if fallback is available
      if (method === 'GET') {
        const fallback = getFallbackForEndpoint<T>(endpoint);
        if (fallback !== undefined) {
          console.info(`[API] Serving default data for ${endpoint} (${response.status})`);
          return fallback;
        }
      }
      throw new Error(errorMsg);
    }

    // Unwrap standardized API response: { success: true, data: [...] }
    if (json && typeof json === 'object' && 'data' in json && json.success !== undefined) {
      return json.data as T;
    }

    return json as T;
  } catch (err: any) {
    if (method === 'GET') {
      const fallback = getFallbackForEndpoint<T>(endpoint);
      if (fallback !== undefined) {
        console.info(`[API] Serving offline fallback for ${endpoint}`);
        return fallback;
      }
    }
    throw err;
  }
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

  async getGalleryImage(id: string) {
    return request<GalleryImage>(`/gallery/${id}`);
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
    if (data && typeof data === 'object' && 'data' in data && data.success !== undefined) {
      return data.data as GalleryImage;
    }
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

  // Health Check (matches Step 10)
  async checkHealth() {
    return request<{ success: boolean; message: string; environment: string }>('/health');
  },

  // Horoscope Requests (Customer & Admin)
  async createHoroscopeRequest(data: HoroscopeFormData) {
    return request<HoroscopeRequestRecord>('/horoscope-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async directGenerateHoroscope(data: HoroscopeFormData) {
    return request<HoroscopeRequestRecord>('/horoscope-requests/direct-generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getHoroscopeDasha(id: string) {
    return request<VimshottariDashaResult>(`/horoscope-requests/${id}/dasha`);
  },

  async getCurrentHoroscopeDasha(id: string) {
    return request<CurrentDashaHierarchy>(`/horoscope-requests/${id}/dasha/current`);
  },

  async getMyHoroscopeRequests() {
    return request<HoroscopeRequestRecord[]>('/horoscope-requests/my');
  },

  async getHoroscopeRequestById(id: string) {
    return request<HoroscopeRequestRecord>(`/horoscope-requests/${id}`);
  },

  async getAllHoroscopeRequests(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'ALL') query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<HoroscopeRequestRecord[]>(`/horoscope-requests${queryString}`);
  },

  async calculateHoroscope(id: string) {
    return request<HoroscopeRequestRecord>(`/horoscope-requests/${id}/calculate`, {
      method: 'POST',
    });
  },

  async reviewHoroscope(
    id: string,
    data: {
      doshas?: DoshaItem[];
      remedies?: RemedyItem[];
      purohitComments?: string;
      status?: string;
    }
  ) {
    return request<HoroscopeRequestRecord>(`/horoscope-requests/${id}/review`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async approveHoroscope(id: string, purohitComments?: string) {
    return request<HoroscopeRequestRecord>(`/horoscope-requests/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ purohitComments }),
    });
  },

  async rejectHoroscope(id: string, reason: string) {
    return request<HoroscopeRequestRecord>(`/horoscope-requests/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Notifications
  async getNotifications() {
    return request<{ data: NotificationRecord[]; unreadCount: number }>('/notifications');
  },

  async markNotificationAsRead(id: string) {
    return request<NotificationRecord>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  async markAllNotificationsAsRead() {
    return request<{ message: string }>('/notifications/read-all', {
      method: 'PATCH',
    });
  },
};
