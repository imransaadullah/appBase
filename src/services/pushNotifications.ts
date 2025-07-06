import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const setupPushNotifications = async () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission for notifications was denied');
    return;
  }

  // Get the token that uniquely identifies this device
  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo push token:', token);
    // TODO: Send this token to your server
  } catch (error) {
    console.log('Error getting push token:', error);
  }
};

export const schedulePushNotification = async (title: string, body: string, seconds: number = 1) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { data: 'goes here' },
    },
    trigger: { 
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds 
    },
  });
};

export const sendImmediateNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null,
  });
}; 