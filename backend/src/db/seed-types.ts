/** Формат data/seed.json — промежуточный слой между исходными материалами и БД. */
export interface SeedBranch {
  id: string;
  kind: 'main' | 'branch';
  name_ru: string;
  name_kk: string | null;
  name_en: string | null;
  address: string;
  locality: string | null;
  phone: string | null;
  email: string | null;
  hours: string | null;
  lat: number | null;
  lng: number | null;
  coords_precision: 'building' | 'street' | 'town' | null;
  coords_source: string | null;
  show_on_map: boolean;
}

export interface SeedResource {
  id: string;
  kind: 'fund' | 'inventory' | 'case' | 'document' | 'photo' | 'newspaper' | 'page' | 'news' | 'event' | 'person';
  parent_id: string | null;
  branch_id: string | null;
  title: string;
  reference?: string | null;
  fund_no?: string | null;
  inventory_no?: string | null;
  case_no?: string | null;
  year_from?: number | null;
  year_to?: number | null;
  period_label?: string | null;
  doc_type?: string | null;
  language?: string | null;
  sheets?: number | null;
  description?: string | null;
  history_note?: string | null;
  place?: string | null;
  author_org?: string | null;
  topics: string[];
  access: 'open' | 'restricted' | 'metadata_only';
  copy_status: 'available' | 'none' | 'unknown' | 'restricted';
  file_key?: string | null;
  image_url?: string | null;
  source_label: string | null;
  source_url: string | null;
  is_demo?: boolean;
  published_at?: string | null;
}

export interface SeedData {
  generated_at: string;
  branches: SeedBranch[];
  resources: SeedResource[];
  fund_names: Array<{ fund_id: string; ord: number; name: string; period_label: string | null }>;
}
