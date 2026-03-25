import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Modal, Alert, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Mukellef, getMukellefler, addMukellef, deleteMukellef, initials } from '../utils/storage';
import { DEADLINES, Deadline } from '../data/deadlines';
import { diffDays, formatDate } from '../utils/dateUtils';
import { colors, radius, spacing } from '../utils/theme';

const TYPE_OPTIONS = ['KDV', 'Muhtasar', 'Gelir V.', 'Kurumlar V.', 'ÖTV', 'Geçici V.'];

export default function ClientsScreen() {
  const [list, setList] = useState<Mukellef[]>([]);
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showWA, setShowWA] = useState(false);
  const [selectedMukellef, setSelectedMukellef] = useState<Mukellef | null>(null);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);

  const [ad, setAd] = useState('');
  const [vkn, setVkn] = useState('');
  const [telefon, setTelefon] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [notlar, setNotlar] = useState('');

  const load = async () => setList(await getMukellefler());

  useFocusEffect(useCallback(() => { load(); }, []));

  const filtered = list.filter(m =>
    m.ad.toLowerCase().includes(query.toLowerCase()) ||
    m.vkn.includes(query)
  );

  const handleAdd = async () => {
    if (!ad.trim()) return;
    await addMukellef({ ad: ad.trim(), vkn, telefon, types, notlar });
    setAd(''); setVkn(''); setTelefon(''); setTypes([]); setNotlar('');
    setShowAdd(false);
    load();
  };

  const handleDelete = (m: Mukellef) => {
    Alert.alert('Mükellef Sil', `${m.ad} silinsin mi?`, [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => { await deleteMukellef(m.id); load(); } },
    ]);
  };

  const toggleType = (t: string) =>
    setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const openWAModal = (m: Mukellef) => {
    if (!m.telefon) {
      Alert.alert('Telefon Yok', 'Bu mükellef için telefon numarası girilmemiş.');
      return;
    }
    setSelectedMukellef(m);
    setSelectedDeadline(null);
    setShowWA(true);
  };

  const sendWhatsApp = () => {
    if (!selectedMukellef || !selectedDeadline) return;
    const tarih = formatDate(selectedDeadline.date);
    const mesaj = `Sayın ${selectedMukellef.ad}, ${selectedDeadline.title} için son ödeme günü ${tarih}'tir. Bilgilerinize sunarız.`;
    const tel = selectedMukellef.telefon.replace(/\D/g, '');
    const url = `https://wa.me/90${tel}?text=${encodeURIComponent(mesaj)}`;
    Linking.openURL(url);
    setShowWA(false);
  };

  const upcomingDeadlines = DEADLINES.filter(d => diffDays(d.date) >= 0).slice(0, 15);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Mükellefler</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(true)}>
          <Text style={styles.addBtnText}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder="Ad veya VKN ile ara..."
          placeholderTextColor={colors.text4}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView style={styles.scroll}>
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {list.length === 0 ? 'Henüz mükellef yok. + Ekle butonuna basın.' : 'Sonuç bulunamadı.'}
            </Text>
          </View>
        )}
        {filtered.map(m => (
          <TouchableOpacity
            key={m.id}
            style={styles.item}
            onLongPress={() => handleDelete(m)}
            activeOpacity={0.7}
          >
            <View style={[styles.avatar, { backgroundColor: m.renk }]}>
              <Text style={styles.avatarText}>{initials(m.ad)}</Text>
            </View>
            <View style={styles.itemBody}>
              <Text style={styles.itemName}>{m.ad}</Text>
              <Text style={styles.itemSub}>
                {m.vkn ? `VKN: ${m.vkn} · ` : ''}{m.types.join(', ') || 'Tür belirtilmemiş'}
              </Text>
              {!!m.telefon && <Text style={styles.itemNote}>{m.telefon}</Text>}
            </View>
            <TouchableOpacity style={styles.waBtn} onPress={() => openWAModal(m)}>
              <Text style={styles.waBtnText}>WA</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        <Text style={styles.hint}>Silmek için uzun basın</Text>
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Yeni Mükellef Modal */}
      <Modal visible={showAdd} transparent animationType="slide" onRequestClose={() => setShowAdd(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowAdd(false)} />
        <ScrollView style={styles.sheet} bounces={false}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Yeni Mükellef</Text>

          <Text style={styles.fieldLabel}>Ad / Unvan *</Text>
          <TextInput style={styles.input} value={ad} onChangeText={setAd} placeholderTextColor={colors.text4} placeholder="Örn: Ahmet Yılmaz Ltd." />

          <Text style={styles.fieldLabel}>VKN / TC</Text>
          <TextInput style={styles.input} value={vkn} onChangeText={setVkn} placeholderTextColor={colors.text4} placeholder="Vergi kimlik numarası" keyboardType="numeric" />

          <Text style={styles.fieldLabel}>Telefon (WhatsApp)</Text>
          <TextInput style={styles.input} value={telefon} onChangeText={setTelefon} placeholderTextColor={colors.text4} placeholder="5XX XXX XX XX" keyboardType="phone-pad" />

          <Text style={styles.fieldLabel}>Beyanname türleri</Text>
          <View style={styles.typeRow}>
            {TYPE_OPTIONS.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.typePill, types.includes(t) && styles.typePillActive]}
                onPress={() => toggleType(t)}
              >
                <Text style={[styles.typePillText, types.includes(t) && styles.typePillTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Notlar</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={notlar}
            onChangeText={setNotlar}
            placeholderTextColor={colors.text4}
            placeholder="İsteğe bağlı not..."
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
            <Text style={styles.saveBtnText}>Kaydet</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </Modal>

      {/* WhatsApp Modal */}
      <Modal visible={showWA} transparent animationType="slide" onRequestClose={() => setShowWA(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowWA(false)} />
        <View style={styles.waSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>WhatsApp Gönder</Text>
          {selectedMukellef && (
            <Text style={styles.waRecipient}>
              {selectedMukellef.ad} · {selectedMukellef.telefon}
            </Text>
          )}

          <Text style={styles.fieldLabel}>Beyanname Seç</Text>
          <ScrollView style={styles.deadlineList} nestedScrollEnabled>
            {upcomingDeadlines.map(d => {
              const diff = diffDays(d.date);
              const isSelected = selectedDeadline?.id === d.id;
              return (
                <TouchableOpacity
                  key={d.id}
                  style={[styles.dlItem, isSelected && styles.dlItemSelected]}
                  onPress={() => setSelectedDeadline(d)}
                >
                  <View style={styles.dlItemLeft}>
                    <Text style={[styles.dlItemTitle, isSelected && styles.dlItemTitleSelected]} numberOfLines={1}>
                      {d.title}
                    </Text>
                    <Text style={styles.dlItemDate}>{formatDate(d.date)}</Text>
                  </View>
                  <View style={[styles.dlBadge, {
                    backgroundColor: diff <= 7 ? colors.redBg : diff <= 30 ? colors.amberBg : colors.bg3,
                  }]}>
                    <Text style={[styles.dlBadgeText, {
                      color: diff <= 7 ? colors.red : diff <= 30 ? colors.amber : colors.text3,
                    }]}>
                      {diff === 0 ? 'Bugün' : `${diff} gün`}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {selectedDeadline && selectedMukellef && (
            <View style={styles.preview}>
              <Text style={styles.previewLabel}>Mesaj Önizleme</Text>
              <Text style={styles.previewText}>
                {`Sayın ${selectedMukellef.ad}, ${selectedDeadline.title} için son ödeme günü ${formatDate(selectedDeadline.date)}'tir. Bilgilerinize sunarız.`}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.waSendBtn, !selectedDeadline && styles.waSendBtnDisabled]}
            onPress={sendWhatsApp}
            disabled={!selectedDeadline}
          >
            <Text style={styles.waSendBtnText}>WhatsApp'ta Aç ve Gönder</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.xl, paddingBottom: spacing.sm },
  title: { fontSize: 26, fontWeight: '700', color: colors.text1 },
  addBtn: { backgroundColor: colors.blue, paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.full },
  addBtnText: { fontSize: 13, fontWeight: '600', color: colors.text1 },
  searchWrap: { paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
  search: { backgroundColor: colors.bg0, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, color: colors.text2, borderWidth: 0.5, borderColor: colors.border },
  scroll: { flex: 1 },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.xl, paddingVertical: 13, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  itemBody: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '500', color: colors.text1 },
  itemSub: { fontSize: 11, color: colors.text4, marginTop: 2 },
  itemNote: { fontSize: 11, color: colors.text3, marginTop: 2 },
  waBtn: { backgroundColor: '#25D366', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.full },
  waBtnText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  hint: { textAlign: 'center', fontSize: 11, color: colors.text4, padding: spacing.lg },
  empty: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 13, color: colors.text4, textAlign: 'center', lineHeight: 20 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { backgroundColor: colors.bg2, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xl, maxHeight: '85%' },
  waSheet: { backgroundColor: colors.bg2, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xl, paddingBottom: 40 },
  sheetHandle: { width: 36, height: 4, backgroundColor: colors.bg3, borderRadius: 4, alignSelf: 'center', marginBottom: spacing.lg },
  sheetTitle: { fontSize: 18, fontWeight: '600', color: colors.text1, marginBottom: spacing.sm },
  fieldLabel: { fontSize: 11, fontWeight: '600', color: colors.text4, textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 6, marginTop: spacing.md },
  input: { backgroundColor: colors.bg0, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: colors.text2, borderWidth: 0.5, borderColor: colors.border },
  textarea: { height: 72, textAlignVertical: 'top' },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  typePill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.full, borderWidth: 0.5, borderColor: colors.border },
  typePillActive: { backgroundColor: colors.blue, borderColor: colors.blue },
  typePillText: { fontSize: 12, color: colors.text3 },
  typePillTextActive: { color: colors.text1, fontWeight: '500' },
  saveBtn: { backgroundColor: colors.blue, borderRadius: radius.md, padding: 14, alignItems: 'center', marginTop: spacing.lg },
  saveBtnText: { fontSize: 15, fontWeight: '600', color: colors.text1 },
  waRecipient: { fontSize: 13, color: colors.text3, marginBottom: spacing.xs },
  deadlineList: { maxHeight: 200, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.border, marginTop: spacing.xs },
  dlItem: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 12, borderBottomWidth: 0.5, borderBottomColor: colors.border, backgroundColor: colors.bg0 },
  dlItemSelected: { backgroundColor: colors.blueBg },
  dlItemLeft: { flex: 1 },
  dlItemTitle: { fontSize: 12, fontWeight: '500', color: colors.text2 },
  dlItemTitleSelected: { color: colors.blue },
  dlItemDate: { fontSize: 11, color: colors.text4, marginTop: 2 },
  dlBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full, marginLeft: 8 },
  dlBadgeText: { fontSize: 10, fontWeight: '600' },
  preview: { marginTop: spacing.md, backgroundColor: colors.bg0, borderRadius: radius.md, padding: 12, borderWidth: 0.5, borderColor: colors.border },
  previewLabel: { fontSize: 10, fontWeight: '600', color: colors.text4, textTransform: 'uppercase', marginBottom: 6 },
  previewText: { fontSize: 13, color: colors.text2, lineHeight: 20 },
  waSendBtn: { backgroundColor: '#25D366', borderRadius: radius.md, padding: 14, alignItems: 'center', marginTop: spacing.md },
  waSendBtnDisabled: { opacity: 0.4 },
  waSendBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
