// ============================================================
// TYPES — Core type definitions for Việt Phục Remix
// ============================================================

export type GarmentId = 'ao-dai' | 'ao-ngu-than' | 'ao-tu-than' | 'ao-ba-ba';
export type CharacterId = 'ha' | 'dong' | 'xuan' | 'thu' | 'viet' | 'hang';
export type EventId = 'khai-giang' | 'ky-yeu' | 'tet' | 'le-hoi' | 'di-san' | 'van-nghe';
export type WeatherId = 'unspecified' | 'hot' | 'rainy' | 'cool' | 'cold';
export type RegionId = 'bac-bo' | 'trung-bo' | 'nam-bo';
export type StyleId = 'thanh-lich' | 'streetwear' | 'vintage' | 'toi-gian';
export type AccessoryId = 'khan' | 'non' | 'tui' | 'giay' | 'trang-suc' | 'quat' | 'phu-kien-toc';
export type ColorId = 'ivory' | 'burgundy' | 'navy' | 'cream' | 'earth-tone' | 'pastel' | 'black';

export type RemixLabel = 'Nguyên bản' | 'Cách tân' | 'Remix mạnh';
export type CulturalStatus = 'green' | 'yellow' | 'red' | 'unknown';
export type CertaintyLevel = 'consensus' | 'multiple_views' | 'reconstruction';
export type ReviewStatus = 'draft' | 'in_review' | 'reviewed';

export interface Garment {
  id: GarmentId;
  name: string;
  shortDescription: string;
  description: string;
  characteristics: string[];
  typicalOccasions: string[];
  region: RegionId[];
  components: string[];
  remixNotes: string;
  culturalNote: CulturalNote;
}

export interface VietEvent {
  id: EventId;
  name: string;
  description: string;
  icon: string;
  suggestedGarments: GarmentId[];
  season?: string;
}

export interface Region {
  id: RegionId;
  name: string;
  description: string;
  suggestedGarments: GarmentId[];
}

export interface Style {
  id: StyleId;
  name: string;
  description: string;
  keywords: string[];
}

export interface Accessory {
  id: AccessoryId;
  name: string;
  category: string;
  variants: AccessoryVariant[];
}

export interface AccessoryVariant {
  id: string;
  name: string;
  description: string;
  compatibleGarments: GarmentId[];
  remixRange: [number, number]; // min-max remix level where this is appropriate
}

export interface ColorOption {
  id: ColorId;
  name: string;
  hex: string;
  description: string;
}

export interface CulturalNote {
  context: string;
  characteristics: string;
  usage: string;
  remixAdvice: string;
  sources: SourceRef[];
  certainty: CertaintyLevel;
  // viewsNote bắt buộc khi certainty !== 'consensus'
  viewsNote?: string;
  status: ReviewStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  researchLeads: string[];
}

// Source reference — liên kết đến Source.id (không copy toàn bộ Source)
export interface SourceRef {
  sourceId: string;
  note?: string;
}

// Source schema per Phase 4 spec
export interface Source {
  id: string;
  grade: 'A' | 'B' | 'C';
  type: 'museum' | 'research' | 'book' | 'artisan' | 'press' | 'other';
  title: string;
  author?: string;
  publisher?: string;
  year?: number;
  url?: string;
  accessedAt?: string;
}

// Reviewer schema per Phase 4 spec
export interface Reviewer {
  id: string;
  name: string;
  role: string;
  org?: string;
  reviewedAt: string;
  scope: string[];
}

// Legacy inline source — kept for backwards compat, prefer SourceRef
export interface CulturalSource {
  title: string;
  type: 'book' | 'article' | 'museum' | 'oral' | 'research_lead';
  note: string;
}

export interface RemixPreferences {
  garment: GarmentId | null;
  character?: CharacterId;
  event: EventId | null;
  weather?: WeatherId;
  region: RegionId | null;
  style: StyleId | null;
  colors: ColorId[];
  accessories: AccessoryId[];
  accessoryVariants?: string[];
  remixLevel: number; // 0-100
}

export interface OutfitResult {
  id: string;
  title: string;
  outfit: OutfitComposition;
  items: OutfitItem[];
  palette: PaletteColor[];
  remixLevel: number;
  remixLabel: RemixLabel;
  stylingReason: string;
  culturalContext: CulturalContextResult;
  tags: string[];
  createdAt: string;
}

export interface OutfitComposition {
  garment: GarmentId;
  garmentName: string;
  character: CharacterId;
  accessoryVariants?: string[];
  event: EventId;
  eventName: string;
  weather?: WeatherId;
  region: RegionId;
  regionName: string;
  style: StyleId;
  styleName: string;
}

export interface OutfitItem {
  category: 'garment' | 'bottom' | 'accessory' | 'footwear' | 'bag' | 'headwear';
  name: string;
  description: string;
  color: string;
}

export interface PaletteColor {
  name: string;
  hex: string;
  role: 'primary' | 'secondary' | 'accent';
}

export interface CulturalContextResult {
  status: CulturalStatus;
  message: string;
  reasons: CulturalReason[];
  suggestions: string[];
  sources: CulturalSource[];
}

export interface CulturalReason {
  what: string;
  why: string;
  howToFix: string;
}

export interface LookbookEntry {
  id: string;
  outfit: OutfitResult;
  savedAt: string;
  note?: string;
}

export interface ColorHarmonyResult {
  score: number; // 0-100
  label: string;
  description: string;
}
