export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
}

export interface PoojaCategory {
  id: string;
  nameEnglish: string;
  nameKannada: string;
  isActive: boolean;
  _count?: {
    items: number;
  };
}

export interface PoojaItem {
  id: string;
  nameEnglish: string;
  nameKannada: string;
  categoryId: string;
  category?: {
    id: string;
    nameEnglish: string;
    nameKannada: string;
  };
  defaultQuantity?: string | null;
  isActive: boolean;
  isCustom?: boolean;
}

export interface SelectedItem {
  item: PoojaItem;
  quantity: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  images?: string[];
  captionEnglish: string;
  captionKannada: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export interface PoojaDetailsFormData {
  poojaName: string;
  poojaDate: string;
  poojaTime: string;
  personName: string;
  gothra?: string;
  nakshatra?: string;
  contactNumber?: string;
  location?: string;
  notes?: string;
}

export interface PoojaRequestItem {
  id?: string;
  poojaItemId?: string | null;
  nameEnglish: string;
  nameKannada: string;
  quantity?: string | null;
}

export interface PoojaRequestRecord {
  id: string;
  userId?: string | null;
  poojaName: string;
  poojaDate: string;
  poojaTime: string;
  personName: string;
  gothra?: string | null;
  nakshatra?: string | null;
  contactNumber?: string | null;
  location?: string | null;
  notes?: string | null;
  createdAt: string;
  items: PoojaRequestItem[];
}

export interface WebsiteSettings {
  purohit_name?: string;
  purohit_name_kannada?: string;
  purohit_phone?: string;
  purohit_address?: string;
  purohit_address_kannada?: string;
  google_maps_url?: string;
  [key: string]: string | undefined;
}

