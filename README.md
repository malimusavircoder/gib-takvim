# GİB Takvim

2026 yılı TÜRMOB resmi vergi takvimini mobil uygulama olarak sunar.

## Özellikler

- Acil ve yaklaşan beyanname tarihleri (kaç gün kaldı)
- Yıllık takvim görünümü (KDV, Muhtasar, Gelir V. vb. filtreli)
- Mükellef takibi
- WhatsApp ile son ödeme günü hatırlatma gönderimi
- Bildirim / hatırlatma sistemi

## Kurulum
```bash
npm install
npx expo start
```

## PDF'den Takvim Üretme
TÜRMOB PDF dosyasını uygulamaya entegre etmek için:

```bash
python3 -m pip install --user pypdf
python3 scripts/generate_deadlines_from_pdf.py --input /Users/murattufan/Desktop/-2026_vergi_takvimi.pdf
```

Bu komut `src/data/deadlines.ts` dosyasını PDF içeriğinden yeniden üretir.

## Teknoloji

- React Native / Expo SDK 54
- TypeScript
- AsyncStorage
- Expo Notifications

## Kaynak

TÜRMOB 2026 Resmi Vergi Takvimi
