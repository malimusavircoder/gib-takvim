import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Deadline } from '../data/deadlines';
import { diffDays, formatShortDate, getBadge, getTypeStyle } from '../utils/dateUtils';
import { colors, radius, spacing } from '../utils/theme';

interface Props {
  item: Deadline;
  onPress: (item: Deadline) => void;
}

export default function DeadlineCard({ item, onPress }: Props) {
  const diff = diffDays(item.date);
  const badge = getBadge(diff);
  const typeStyle = getTypeStyle(item.type);
  const isPast = diff < 0;
  const subtitle = item.items.length > 1
    ? `${formatShortDate(item.date)} · ${item.items.length} yükümlülük`
    : `${formatShortDate(item.date)} · ${typeStyle.label}`;

  return (
    <TouchableOpacity
      style={[styles.card, isPast && styles.past]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.dot, { backgroundColor: typeStyle.dotColor }]} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.date}>{subtitle}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: badge.bgColor }]}>
        <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 11,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg1,
  },
  past: { opacity: 0.45 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  body: { flex: 1, minWidth: 0 },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text2,
  },
  date: {
    fontSize: 11,
    color: colors.text4,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radius.full,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
