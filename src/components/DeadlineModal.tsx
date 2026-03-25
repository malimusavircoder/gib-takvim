import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Deadline } from '../data/deadlines';
import { diffDays, formatDate, getBadge, getTypeStyle } from '../utils/dateUtils';
import { colors, radius, spacing } from '../utils/theme';

interface Props {
  item: Deadline | null;
  onClose: () => void;
}

export default function DeadlineModal({ item, onClose }: Props) {
  if (!item) return null;
  const diff = diffDays(item.date);
  const badge = getBadge(diff);
  const typeStyle = getTypeStyle(item.type);

  return (
    <Modal visible={!!item} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <View style={[styles.typePill, { backgroundColor: colors.bg3 }]}>
            <View style={[styles.dot, { backgroundColor: typeStyle.dotColor }]} />
            <Text style={[styles.typeText, { color: typeStyle.dotColor }]}>{typeStyle.label}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: badge.bgColor }]}>
            <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
          </View>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
        <View style={styles.divider} />
        <Text style={styles.noteLabel}>Açıklama</Text>
        <Text style={styles.note}>{item.note}</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>Kapat</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.bg2,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: 40,
    borderTopWidth: 0.5,
    borderColor: colors.border,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.bg3,
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  typeText: { fontSize: 11, fontWeight: '600' },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text1,
    lineHeight: 24,
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: colors.text3,
    marginBottom: spacing.lg,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text4,
    letterSpacing: 0.06,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  note: {
    fontSize: 14,
    color: colors.text2,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  closeBtn: {
    backgroundColor: colors.bg3,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text2,
  },
});
