// En src/services/pushNotifications.js
import * as Notifications from 'expo-notifications';

export const setupPushNotifications = async (userId) => {
  const { status } = await Notifications.requestPermissionsAsync();
  
  if (status !== 'granted') {
    alert('Necesitas activar los permisos de notificaciones');
    return;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  
  // Guardar token en Firebase para enviar notificaciones
  await savePushToken(userId, token.data);
};

export const scheduleTestNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "¡MVP Deportes!",
      body: "Esta es una notificación de prueba",
    },
    trigger: { seconds: 2 },
  });
};

const savePushToken = async (userId, token) => {
  // Implementar guardado en Firebase
  console.log('Guardando token:', token, 'para usuario:', userId);
};