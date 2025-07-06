import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { schedulePushNotification, sendImmediateNotification } from '../../../services/pushNotifications';

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Get the push token
    Notifications.getExpoPushTokenAsync().then(token => {
      setExpoPushToken(token.data);
    });

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listen for notification responses (when user taps notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const scheduleNotification = async (title: string, body: string, seconds: number = 1) => {
    await schedulePushNotification(title, body, seconds);
  };

  const sendNotification = async (title: string, body: string) => {
    await sendImmediateNotification(title, body);
  };

  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  return {
    expoPushToken,
    notification,
    scheduleNotification,
    sendNotification,
    cancelAllNotifications,
  };
}; 