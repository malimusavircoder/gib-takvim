import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DEADLINES, Deadline, DeadlineType, TYPE_LABELS, MONTHS_TR } from '../data/deadlines';
import { diffDays } from '../utils/dateUtils';
import { colors, radius, spacing } from '../utils/theme';
import DeadlineCard from '../components/DeadlineCard';
import DeadlineModal from '../components/DeadlineModal';

const FILTERS: { key: 'all' | DeadlineType; label: string }[] = [
  { key: 'all',      label: 'Tümü' },
  { key: 'kdv',      label: 'KDV' },
  { key: 'muhtasar', label: 'Muhtasar' },
  { key: 'gv',       label: 'Gelir V.' },
  { key: 'kv',       label: 'Kurumlar V.' },
  { key: 'gecici',   label: 'Geçici V.' },
  { key: 'otv',      label: 'ÖTV' },
  { key: 'diger',    label: 'Diğer' },
];

export default function CalendarScreen() {
  const [filter, setFilter] = useState<'all' | DeadlineType>('all');
  const [selected, setSelected] = useState<Deadline | null>(null);

  const filtered = filter === 'all' ? DEADLINES : DEADLINES.filter(d => d.types.includes(filter));

  const byMonth: Record<number, Deadline[]> = {};
  filtered.forEach(d => {
    const m = Number(d.date.split('-')[1]);
    if (!byMonth[m]) byMonth[m] = [];
    byMonth[m].push(d);
  });

  const isMaliTatil = (m: number) => m === 7;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Takvim</Text>
        <Text style={styles.sub}>2026 yılı beyanname takvimi</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterPill, filter === f.key && styles.filterActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
          const items = byMonth[m];
          if (!items?.length) return null;
          return (
            <View key={m} style={styles.monthSection}>
              <View style={styles.monthHeader}>
                <Text style={styles.monthTitle}>{MONTHS_TR[m]} 2026</Text>
                {isMaliTatil(m) && (
                  <View style={styles.maliTatilBadge}>
                    <Text style={styles.maliTatilText}>Mali Tatil 1-20 Tem</Text>
                  </View>
                )}
              </View>
              {items.map(d => <DeadlineCard key={d.id} item={d} onPress={setSelected} />)}
            </View>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>

      <DeadlineModal item={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg1 },
  header: { padding: spacing.xl, paddingBottom: spacing.sm },
  title: { fontSize: 26, fontWeight: '700', color: colors.text1 },
  sub: { fontSize: 12, color: colors.text4, marginTop: 3 },
  filterRow: { marginBottom: spacing.sm },
  filterContent: { paddingHorizontal: spacing.xl, gap: 8, paddingRight: spacing.xl },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  filterActive: { backgroundColor: colors.blue, borderColor: colors.blue },
  filterText: { fontSize: 12, color: colors.text3 },
  filterTextActive: { color: colors.text1, fontWeight: '500' },
  scroll: { flex: 1 },
  monthSection: { marginBottom: 4 },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  monthTitle: { fontSize: 13, fontWeight: '600', color: colors.text3 },
  maliTatilBadge: {
    backgroundColor: colors.amberBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  maliTatilText: { fontSize: 10, color: colors.amberText, fontWeight: '500' },
});
