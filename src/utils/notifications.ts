import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { DEADLINES } from '../data/deadlines';
import { parseDate } from './dateUtils';

const DEFAULT_CHANNEL_ID = 'deadline-reminders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensureAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
    name: 'Beyanname Hatirlatmalari',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#378ADD',
  });
}

export async function requestPermissions(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export function getReminderDays(enabledMap: {
  days7: boolean;
  days3: boolean;
  days1: boolean;
  sameDay: boolean;
}): number[] {
  const daysList: number[] = [];
  if (enabledMap.days7) daysList.push(7);
  if (enabledMap.days3) daysList.push(3);
  if (enabledMap.days1) daysList.push(1);
  if (enabledMap.sameDay) daysList.push(0);
  return daysList;
}

export async function scheduleAllReminders(
  daysBefore: number[],
  options?: { requestPermission?: boolean }
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await ensureAndroidNotificationChannel();

  const granted = options?.requestPermission === false
    ? (await Notifications.getPermissionsAsync()).granted
    : await requestPermissions();

  if (!granted) return;

  const now = new Date();

  for (const dl of DEADLINES) {
    const deadlineDate = parseDate(dl.date);

    for (const days of daysBefore) {
      const triggerDate = new Date(deadlineDate);
      triggerDate.setDate(triggerDate.getDate() - days);
      triggerDate.setHours(9, 0, 0, 0);

      if (triggerDate <= now) continue;

      let body = '';
      if (days === 0) body = `${dl.title} için bugün son gün!`;
      else if (days === 1) body = `${dl.title} için yarın son gün.`;
      else body = `${dl.title} için ${days} gün kaldı.`;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'GİB Takvim',
          body,
          data: { deadlineId: dl.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
          ...(Platform.OS === 'android' ? { channelId: DEFAULT_CHANNEL_ID } : {}),
        },
      });
    }
  }
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
