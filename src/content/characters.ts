import type { CharacterId } from '../types';

export interface RepresentativeCharacter {
  id: CharacterId;
  name: string;
  description: string;
  presentation: 'feminine' | 'masculine';
  ageGroup: 'adult' | 'child' | 'elder';
  skinTone: string;
  hairColor: string;
  hairStyle: 'long' | 'short' | 'bob' | 'tied' | 'elder-man' | 'elder-woman';
  heightScale: number;
  widthScale: number;
}

export const DEFAULT_CHARACTER_ID: CharacterId = 'ha';

export const representativeCharacters: RepresentativeCharacter[] = [
  { id: 'ha', name: 'Hạ', description: 'Nữ · trưởng thành', presentation: 'feminine', ageGroup: 'adult', skinTone: '#D9A47F', hairColor: '#2C211E', hairStyle: 'long', heightScale: 1, widthScale: 0.94 },
  { id: 'dong', name: 'Đông', description: 'Nam · trưởng thành', presentation: 'masculine', ageGroup: 'adult', skinTone: '#C78F69', hairColor: '#211A18', hairStyle: 'short', heightScale: 1.02, widthScale: 1.04 },
  { id: 'xuan', name: 'Xuân', description: 'Bé trai', presentation: 'masculine', ageGroup: 'child', skinTone: '#E0B08A', hairColor: '#30231F', hairStyle: 'short', heightScale: 0.79, widthScale: 0.84 },
  { id: 'thu', name: 'Thu', description: 'Bé gái', presentation: 'feminine', ageGroup: 'child', skinTone: '#E5B99A', hairColor: '#342421', hairStyle: 'tied', heightScale: 0.79, widthScale: 0.84 },
  { id: 'viet', name: 'Việt', description: 'Ông · lớn tuổi', presentation: 'masculine', ageGroup: 'elder', skinTone: '#C99473', hairColor: '#B6AAA0', hairStyle: 'elder-man', heightScale: 0.95, widthScale: 1.04 },
  { id: 'hang', name: 'Hằng', description: 'Bà · lớn tuổi', presentation: 'feminine', ageGroup: 'elder', skinTone: '#D6A98C', hairColor: '#C4B7AD', hairStyle: 'elder-woman', heightScale: 0.94, widthScale: 0.98 },
];

export function getRepresentativeCharacter(id?: CharacterId) {
  return representativeCharacters.find(character => character.id === id) || representativeCharacters[0];
}