import * as Notifications from 'expo-notifications';
import { DEADLINES } from '../data/deadlines';
import { parseDate } from './dateUtils';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleAllReminders(daysBefore: number[]): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const granted = await requestPermissions();
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
        trigger: triggerDate,
      });
    }
  }
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
