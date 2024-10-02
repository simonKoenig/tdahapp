import messaging from '@react-native-firebase/messaging';
import { Vibration } from 'react-native';
import Toast from 'react-native-toast-message';


export const setupNotificationListeners = () => {
    console.log('Configurando listeners de notificaciones en primer plano...');

    // Listener para mensajes en primer plano
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
        Vibration.vibrate();
        Toast.show({
            type: 'info',
            text1: remoteMessage.notification.title,
            text2: remoteMessage.notification.body,
        });
    });

    // Listener para cuando la app está en segundo plano y el usuario toca la notificación
    messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('Notificación abierta desde segundo plano:', remoteMessage.notification);
    });

    // Listener para cuando la app fue abierta desde un estado cerrado por completo
    messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
            if (remoteMessage) {
                console.log('Notificación que abrió la app desde un estado cerrado:', remoteMessage.notification);
            }
        });

    // Retornar la función de limpieza para eliminar el listener de primer plano
    return unsubscribeOnMessage;
};

// Background Message Handler
export const setupBackgroundHandler = () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Mensaje recibido en segundo plano:', remoteMessage);
        // Aquí puedes manejar la lógica adicional, como mostrar una notificación o actualizar la base de datos
    });
};