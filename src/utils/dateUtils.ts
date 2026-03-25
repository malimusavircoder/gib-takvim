import { MONTHS_TR, DAYS_TR } from '../data/deadlines';
import { colors } from './theme';

export function parseDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function diffDays(dateStr: string): number {
  const today = new Date();
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const d = parseDate(dateStr);
  return Math.round((d.getTime() - t.getTime()) / 86400000);
}

export function formatDate(str: string): string {
  const d = parseDate(str);
  return `${d.getDate()} ${MONTHS_TR[d.getMonth() + 1]} ${d.getFullYear()} ${DAYS_TR[d.getDay()]}`;
}

export function formatShortDate(str: string): string {
  const d = parseDate(str);
  return `${d.getDate()} ${MONTHS_TR[d.getMonth() + 1]}`;
}

export interface BadgeInfo {
  text: string;
  color: string;
  bgColor: string;
}

export function getBadge(diff: number): BadgeInfo {
  if (diff < 0)   return { text: 'Geçti',  color: colors.text3, bgColor: colors.bg3 };
  if (diff === 0) return { text: 'BUGÜN',  color: colors.redText, bgColor: colors.redBg };
  if (diff === 1) return { text: 'Yarın',  color: colors.redText, bgColor: colors.redBg };
  if (diff <= 7)  return { text: `${diff} gün`, color: colors.redText, bgColor: colors.redBg };
  if (diff <= 30) return { text: `${diff} gün`, color: colors.amberText, bgColor: colors.amberBg };
  return             { text: `${diff} gün`, color: colors.greenText, bgColor: colors.greenBg };
}

export interface TypeStyle {
  dotColor: string;
  label: string;
}

export function getTypeStyle(type: string): TypeStyle {
  const map: Record<string, TypeStyle> = {
    kdv:      { dotColor: colors.blue,  label: 'KDV' },
    muhtasar: { dotColor: colors.amber, label: 'Muhtasar' },
    gv:       { dotColor: colors.red,   label: 'Gelir V.' },
    kv:       { dotColor: colors.red,   label: 'Kurumlar V.' },
    otv:      { dotColor: colors.green, label: 'ÖTV' },
    gecici:   { dotColor: colors.amber, label: 'Geçici V.' },
    diger:    { dotColor: colors.teal,  label: 'Diğer' },
  };
  return map[type] ?? { dotColor: colors.text3, label: type };
}
