export type DeadlineType = 'kdv' | 'muhtasar' | 'gv' | 'kv' | 'otv' | 'gecici' | 'diger';

export interface Deadline {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: DeadlineType;
  note: string;
}

export const DEADLINES: Deadline[] = [
  { id: 'd01', date: '2026-03-25', title: 'Şubat KDV sorumlulari + 1-15 Mart petrol ÖTV', type: 'kdv',      note: 'Şubat dönemi KDV sorumluluk beyannamesi ve Ocak ayı 1-15 arası petrol ÖTV beyannamesi.' },
  { id: 'd02', date: '2026-03-26', title: 'Şubat Muhtasar + Prim + Damga + Konaklama',    type: 'muhtasar', note: 'Şubat dönemi muhtasar ve prim hizmet beyannamesi, damga vergisi ve konaklama vergisi.' },
  { id: 'd03', date: '2026-03-30', title: 'Şubat KDV beyannamesi ve ödemesi',              type: 'kdv',      note: 'Normalde 28 Şubat Pazar olduğundan 30 Mart Pazartesi\'ye kaydı. KDV son gün!' },
  { id: 'd04', date: '2026-03-31', title: '2025 Yıllık Gelir Vergisi + 1. Taksit',         type: 'gv',       note: '2025 yılı yıllık gelir vergisi beyannamesi verilmesi ve 1. taksit ödemesi son günü.' },
  { id: 'd05', date: '2026-04-07', title: 'Mart noterlik makbuz beyannamesi',              type: 'diger',    note: 'Mart ayına ait noterlerce yapılan makbuz ödemelere ilişkin beyanname.' },
  { id: 'd06', date: '2026-04-15', title: 'Mart ÖTV (alkol, dayanıklı, taşıt, BSMV)',     type: 'otv',      note: 'Mart dönemi ÖTV beyannamesi: alkol, tüketime dayanıklı mallar, taşıt, özel iletişim, BSMV, KKDF.' },
  { id: 'd07', date: '2026-04-20', title: 'Mart eğlence / ilan / reklam / elektrik',       type: 'diger',    note: 'Mart ayına ait eğlence vergisi, ilan ve reklam vergisi, elektrik ve havagazı tüketim vergisi, yangın sigortası vergisi, şans oyunları vergisi.' },
  { id: 'd08', date: '2026-04-27', title: 'Mart Muhtasar + üçerlik + Oca-Şub-Mar + Damga', type: 'muhtasar', note: 'Mart muhtasar, üçerlik muhtasar (Oca-Şub-Mar dönemi), damga vergisi, konaklama vergisi ve KDV sorumlulari.' },
  { id: 'd09', date: '2026-04-28', title: 'Mart KDV + Oca-Şub-Mar dönem KDV',              type: 'kdv',      note: 'Mart ayı KDV ve Ocak-Şubat-Mart üç aylık dönem KDV beyannamesi ve ödemesi.' },
  { id: 'd10', date: '2026-04-30', title: '2025 Kurumlar Vergisi beyannamesi ve ödemesi',  type: 'kv',       note: '2025 hesap dönemi kurumlar vergisi beyannamesinin verilmesi ve ödenmesi son günü.' },
  { id: 'd11', date: '2026-05-18', title: '2026 I. Dönem Geçici Vergi (Oca-Şub-Mar)',      type: 'gecici',   note: '2026 yılı birinci üç aylık dönemi (Ocak-Şubat-Mart) geçici vergi beyannamesi.' },
  { id: 'd12', date: '2026-05-26', title: 'Nisan Muhtasar + Damga + Konaklama',            type: 'muhtasar', note: 'Nisan dönemi muhtasar ve prim hizmet beyannamesi, damga ve konaklama vergisi.' },
  { id: 'd13', date: '2026-06-01', title: 'Nisan KDV (Pazar\'dan 1 Haziran\'a kaydı)',     type: 'kdv',      note: 'Normalde 31 Mayıs Pazar olduğundan 1 Haziran Pazartesi\'ye kaydı.' },
  { id: 'd14', date: '2026-06-26', title: 'Mayıs Muhtasar + Damga + Konaklama',            type: 'muhtasar', note: 'Mayıs dönemi muhtasar ve prim hizmet beyannamesi, damga ve konaklama vergisi.' },
  { id: 'd15', date: '2026-06-29', title: 'Mayıs KDV beyannamesi',                         type: 'kdv',      note: 'Mayıs ayı KDV beyannamesi ve ödemesi.' },
  { id: 'd16', date: '2026-07-27', title: 'Haziran Muhtasar (mali tatil kayması)',          type: 'muhtasar', note: 'Mali tatil (1-20 Temmuz) nedeniyle kaymış Haziran muhtasar beyannamesi.' },
  { id: 'd17', date: '2026-07-28', title: 'Haziran KDV (mali tatil kayması)',               type: 'kdv',      note: 'Mali tatil (1-20 Temmuz) nedeniyle kaymış Haziran KDV beyannamesi.' },
  { id: 'd18', date: '2026-07-31', title: '2025 Gelir Vergisi 2. Taksit + MTV 2. Taksit',  type: 'gv',       note: 'Gelir vergisi ikinci taksit ödemesi ve motorlu taşıtlar vergisi ikinci taksit ödemesi.' },
  { id: 'd19', date: '2026-08-17', title: 'II. Dönem Geçici Vergi (Nis-May-Haz) + Tem ÖTV', type: 'gecici', note: '2026 ikinci üç aylık dönem (Nisan-Mayıs-Haziran) geçici vergi ve Temmuz ÖTV beyannamesi.' },
  { id: 'd20', date: '2026-08-26', title: 'Temmuz Muhtasar + Damga + Konaklama',           type: 'muhtasar', note: 'Temmuz dönemi muhtasar ve prim hizmet beyannamesi, damga ve konaklama vergisi.' },
  { id: 'd21', date: '2026-08-28', title: 'Temmuz KDV beyannamesi',                        type: 'kdv',      note: 'Temmuz ayı KDV beyannamesi ve ödemesi.' },
  { id: 'd22', date: '2026-09-25', title: 'Ağustos KDV sorumlulari',                       type: 'kdv',      note: 'Ağustos dönemi KDV sorumluluk beyannamesi.' },
  { id: 'd23', date: '2026-09-28', title: 'Ağustos KDV + Muhtasar + Konaklama',            type: 'kdv',      note: 'Ağustos ayı KDV beyannamesi, muhtasar ve konaklama vergisi.' },
  { id: 'd24', date: '2026-10-26', title: 'Eylül Muhtasar + üçerlik + Damga + KDV sor.',  type: 'muhtasar', note: 'Eylül muhtasar, üçerlik muhtasar (Tem-Ağu-Eyl), konaklama vergisi, KDV sorumlulari.' },
  { id: 'd25', date: '2026-10-28', title: 'Eylül KDV + Tem-Ağu-Eyl dönem KDV',            type: 'kdv',      note: 'Eylül KDV ve Temmuz-Ağustos-Eylül üç aylık dönem KDV beyannamesi.' },
  { id: 'd26', date: '2026-11-17', title: 'III. Dönem Geçici Vergi (Tem-Ağu-Eyl)',         type: 'gecici',   note: '2026 üçüncü üç aylık dönem (Temmuz-Ağustos-Eylül) geçici vergi beyannamesi.' },
  { id: 'd27', date: '2026-11-26', title: 'Ekim Muhtasar + Damga + Konaklama',             type: 'muhtasar', note: 'Ekim dönemi muhtasar ve prim hizmet beyannamesi, damga ve konaklama vergisi.' },
  { id: 'd28', date: '2026-11-30', title: 'Ekim KDV + Emlak 2. Taksit + Çevre 2. Taksit', type: 'kdv',      note: 'Ekim KDV, emlak vergisi ikinci taksit ve çevre temizlik vergisi ikinci taksit ödemeleri.' },
  { id: 'd29', date: '2026-12-25', title: 'Kasım KDV sorumlulari',                         type: 'kdv',      note: 'Kasım dönemi KDV sorumluluk beyannamesi.' },
  { id: 'd30', date: '2026-12-28', title: 'Kasım KDV + Muhtasar + Konaklama',              type: 'kdv',      note: 'Kasım ayı KDV beyannamesi, muhtasar ve konaklama vergisi.' },
  { id: 'd31', date: '2026-12-31', title: 'Defter açılış tasdiki (2027) + yıllık yük.',   type: 'diger',    note: '2027 hesap dönemi defter açılış tasdiki ve çeşitli yıllık yükümlülükler son günü.' },
];

export const TYPE_LABELS: Record<DeadlineType, string> = {
  kdv:      'KDV',
  muhtasar: 'Muhtasar',
  gv:       'Gelir V.',
  kv:       'Kurumlar V.',
  otv:      'ÖTV',
  gecici:   'Geçici V.',
  diger:    'Diğer',
};

export const MONTHS_TR = ['', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

export const DAYS_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
