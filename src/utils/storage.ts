import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Mukellef {
  id: string;
  ad: string;
  vkn: string;
  telefon: string;
  types: string[];
  notlar: string;
  renk: string;
}

const KEY = 'gib_mukellefler';

const RENKLER = ['#185fa5', '#085041', '#26215c', '#712b13', '#3b6d11', '#854f0b', '#993556'];

export async function getMukellefler(): Promise<Mukellef[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveMukellefler(list: Mukellef[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function addMukellef(data: Omit<Mukellef, 'id' | 'renk'>): Promise<Mukellef> {
  const list = await getMukellefler();
  const renk = RENKLER[list.length % RENKLER.length];
  const m: Mukellef = { ...data, id: Date.now().toString(), renk };
  await saveMukellefler([...list, m]);
  return m;
}

export async function deleteMukellef(id: string): Promise<void> {
  const list = await getMukellefler();
  await saveMukellefler(list.filter(m => m.id !== id));
}

export function initials(ad: string): string {
  return ad.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
