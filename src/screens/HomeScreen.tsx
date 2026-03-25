import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DEADLINES, Deadline, MONTHS_TR, DAYS_TR } from '../data/deadlines';
import { diffDays } from '../utils/dateUtils';
import { colors, radius, spacing } from '../utils/theme';
import DeadlineCard from '../components/DeadlineCard';
import DeadlineModal from '../components/DeadlineModal';

export default function HomeScreen() {
  const [selected, setSelected] = useState<Deadline | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(new Date());

  useFocusEffect(useCallback(() => { setNow(new Date()); }, []));

  const onRefresh = () => {
    setRefreshing(true);
    setNow(new Date());
    setTimeout(() => setRefreshing(false), 500);
  };

  const enriched = DEADLINES.map(d => ({ ...d, diff: diffDays(d.date) }));
  const acil   = enriched.filter(d => d.diff >= 0 && d.diff <= 7);
  const yakin  = enriched.filter(d => d.diff > 7 && d.diff <= 30);
  const kalan  = enriched.filter(d => d.diff > 30);
  const gecmis = enriched.filter(d => d.diff < 0).reverse().slice(0, 3);

  const todayStr = `${now.getDate()} ${MONTHS_TR[now.getMonth() + 1]} ${now.getFullYear()}, ${DAYS_TR[now.getDay()]}`;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.blue} />}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hoş geldiniz</Text>
          <Text style={styles.appTitle}>GİB Takvim</Text>
          <Text style={styles.dateText}>{todayStr}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow} contentContainerStyle={styles.statsContent}>
          <StatCard num={acil.length}  label="Bu hafta acil"    numColor={colors.red}   bg={colors.redBg} />
          <StatCard num={yakin.length} label="Bu ay yaklaşan"   numColor={colors.amber} bg={colors.amberBg} />
          <StatCard num={kalan.length} label="Yıl içinde kalan" numColor={colors.blue}  bg={colors.blueBg} />
        </ScrollView>

        {acil.length > 0 && (
          <>
            <SectionHeader title="Acil beyannameler" sub="7 gün içinde" />
            {acil.map(d => <DeadlineCard key={d.id} item={d} onPress={setSelected} />)}
          </>
        )}

        {yakin.length > 0 && (
          <>
            <SectionHeader title="Yaklaşan beyannameler" sub="30 gün içinde" />
            {yakin.slice(0, 5).map(d => <DeadlineCard key={d.id} item={d} onPress={setSelected} />)}
          </>
        )}

        {acil.length === 0 && yakin.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>30 gün içinde beyanname yok.</Text>
          </View>
        )}

        {gecmis.length > 0 && (
          <>
            <SectionHeader title="Son geçenler" />
            {gecmis.map(d => <DeadlineCard key={d.id} item={d} onPress={setSelected} />)}
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      <DeadlineModal item={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

function StatCard({ num, label, numColor, bg }: { num: number; label: string; numColor: string; bg: string }) {
  return (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      <Text style={[styles.statNum, { color: numColor }]}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {sub && <Text style={styles.sectionSub}>{sub}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg1 },
  scroll: { flex: 1 },
  header: { padding: spacing.xl, paddingBottom: spacing.md },
  greeting: { fontSize: 12, color: colors.text4, letterSpacing: 0.04 },
  appTitle: { fontSize: 26, fontWeight: '700', color: colors.text1, marginTop: 2 },
  dateText: { fontSize: 12, color: colors.text4, marginTop: 3 },
  statsRow: { marginBottom: spacing.sm },
  statsContent: { paddingHorizontal: spacing.xl, gap: spacing.sm, paddingRight: spacing.xl },
  statCard: {
    borderRadius: radius.lg,
    padding: spacing.md,
    minWidth: 130,
  },
  statNum: { fontSize: 30, fontWeight: '700', lineHeight: 36 },
  statLabel: { fontSize: 11, color: colors.text4, marginTop: 4 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: { fontSize: 13, fontWeight: '500', color: colors.text3 },
  sectionSub: { fontSize: 11, color: colors.text4 },
  empty: { padding: spacing.xxl, alignItems: 'center' },
  emptyText: { fontSize: 14, color: colors.text4 },
});
