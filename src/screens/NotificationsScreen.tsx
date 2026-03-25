import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleAllReminders, cancelAllReminders, requestPermissions } from '../utils/notifications';
import { DEADLINES, Deadline } from '../data/deadlines';
import { diffDays, formatShortDate, getBadge } from '../utils/dateUtils';
import { colors, radius, spacing } from '../utils/theme';
import DeadlineModal from '../components/DeadlineModal';

const PREFS_KEY = 'gib_notif_prefs';

interface Prefs {
  enabled: boolean;
  days7: boolean;
  days3: boolean;
  days1: boolean;
  sameDay: boolean;
}

const DEFAULT_PREFS: Prefs = { enabled: true, days7: true, days3: true, days1: false, sameDay: true };

export default function NotificationsScreen() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [selected, setSelected] = useState<Deadline | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(PREFS_KEY).then(raw => {
      if (raw) setPrefs(JSON.parse(raw));
    });
  }, []);

  const savePrefs = async (p: Prefs) => {
    setPrefs(p);
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(p));
    if (p.enabled) {
      const daysList: number[] = [];
      if (p.days7)    daysList.push(7);
      if (p.days3)    daysList.push(3);
      if (p.days1)    daysList.push(1);
      if (p.sameDay)  daysList.push(0);
      await scheduleAllReminders(daysList);
    } else {
      await cancelAllReminders();
    }
  };

  const toggle = (key: keyof Prefs) => savePrefs({ ...prefs, [key]: !prefs[key] });

  const upcoming = DEADLINES
    .map(d => ({ ...d, diff: diffDays(d.date) }))
    .filter(d => d.diff >= 0 && d.diff <= 30)
    .slice(0, 8);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Bildirimler</Text>
          <Text style={styles.sub}>Hatırlatma ayarları</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Genel</Text>
          <View style={styles.card}>
            <ToggleRow
              label="Bildirimleri Aç"
              sub="Beyanname hatırlatmaları"
              value={prefs.enabled}
              onToggle={() => {
                if (!prefs.enabled) {
                  requestPermissions().then(ok => {
                    if (!ok) Alert.alert('İzin Gerekli', 'Ayarlardan bildirim iznini etkinleştirin.');
                    else toggle('enabled');
                  });
                } else {
                  toggle('enabled');
                }
              }}
            />
          </View>
        </View>

        <View style={[styles.section, !prefs.enabled && styles.disabled]}>
          <Text style={styles.sectionLabel}>Ne zaman hatırlat?</Text>
          <View style={styles.card}>
            <ToggleRow label="7 gün önce" value={prefs.days7}   onToggle={() => toggle('days7')} />
            <View style={styles.divider} />
            <ToggleRow label="3 gün önce" value={prefs.days3}   onToggle={() => toggle('days3')} />
            <View style={styles.divider} />
            <ToggleRow label="1 gün önce" value={prefs.days1}   onToggle={() => toggle('days1')} />
            <View style={styles.divider} />
            <ToggleRow label="Son gün sabahı" value={prefs.sameDay} onToggle={() => toggle('sameDay')} />
          </View>
        </View>

        {upcoming.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Yaklaşan (30 gün)</Text>
            {upcoming.map(d => {
              const badge = getBadge(d.diff);
              return (
                <TouchableOpacity key={d.id} style={styles.notifItem} onPress={() => setSelected(d)} activeOpacity={0.7}>
                  <View style={[styles.notifIcon, { backgroundColor: badge.bgColor }]}>
                    <Text style={{ fontSize: 14, color: badge.color }}>!</Text>
                  </View>
                  <View style={styles.notifBody}>
                    <Text style={styles.notifTitle} numberOfLines={1}>{d.title}</Text>
                    <Text style={styles.notifDate}>{formatShortDate(d.date)}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: badge.bgColor }]}>
                    <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      <DeadlineModal item={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

function ToggleRow({ label, sub, value, onToggle }: { label: string; sub?: string; value: boolean; onToggle: () => void }) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleLeft}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {sub && <Text style={styles.toggleSub}>{sub}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.bg3, true: colors.blue }}
        thumbColor={colors.text1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg1 },
  scroll: { flex: 1 },
  header: { padding: spacing.xl, paddingBottom: spacing.sm },
  title: { fontSize: 26, fontWeight: '700', color: colors.text1 },
  sub: { fontSize: 12, color: colors.text4, marginTop: 3 },
  section: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  disabled: { opacity: 0.4 },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: colors.text4, textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 8, marginTop: spacing.md },
  card: { backgroundColor: colors.bg2, borderRadius: radius.lg, borderWidth: 0.5, borderColor: colors.border, overflow: 'hidden' },
  divider: { height: 0.5, backgroundColor: colors.border, marginHorizontal: spacing.md },
  toggleRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, paddingHorizontal: spacing.lg },
  toggleLeft: { flex: 1 },
  toggleLabel: { fontSize: 14, color: colors.text2 },
  toggleSub: { fontSize: 11, color: colors.text4, marginTop: 2 },
  notifItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.bg2, borderRadius: radius.lg, marginBottom: 6, borderWidth: 0.5, borderColor: colors.border },
  notifIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  notifBody: { flex: 1 },
  notifTitle: { fontSize: 13, fontWeight: '500', color: colors.text2 },
  notifDate: { fontSize: 11, color: colors.text4, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600' },
});
