import * as React from 'react';
import { AppState, Alert, PermissionsAndroid, Platform } from 'react-native';
import Navigation from './Navigation';
import { AuthProvider } from './Context/AuthProvider';
import { RewardsProvider } from './Context/RewardsProvider';
import { PatientsProvider } from './Context/PatientsProvider'; // Importa el PatientProvider
import { SubjectsProvider } from './Context/SubjectsProvider'; // Importa el SubjectsProvider
import { TasksProvider } from './Context/TaskProvider';
import { clearStorage } from './Utils/AsyncStorage';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  // Limpia el almacenamiento cuando la aplicación pasa a segundo plano o se cierra
  React.useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        clearStorage();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  React.useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await requestUserPermission();

      if (hasPermission) {
        const token = await messaging().getToken();
        console.log('Token FCM del app.js:', token);
        // Aquí puedes enviar el token al servidor para hacer pruebas
      } else {
        console.log('No se ha dado permiso para recibir notificaciones');
      }
      // Comprueba si la app se abrió a través de una notificación cuando estaba cerrada
      messaging()
        .getInitialNotification()
        .then(async (remoteMessage) => {
          if (remoteMessage) {
            console.log('La notificación abrió la app desde el estado cerrado:', remoteMessage.notification);
          }
        });
      // Listener para manejar notificaciones cuando la app está en segundo plano
      messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log('La notificación abrió la app desde el estado de segundo plano:', remoteMessage.notification);
      });

      // Configura un manejador para mensajes en segundo plano
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Mensaje recibido en segundo plano:', remoteMessage);
      });
      // Listener para mensajes en primer plano
      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        Alert.alert('Llegó un nuevo mensaje de FCM:', JSON.stringify(remoteMessage));
      });

      return unsubscribe;
    };

    setupNotifications();
  }, []);

  return (
    <AuthProvider>
      <PatientsProvider>
        <TasksProvider>
          <RewardsProvider>
            <SubjectsProvider>
              <Navigation />
            </SubjectsProvider>
          </RewardsProvider>
        </TasksProvider>
      </PatientsProvider>
    </AuthProvider>
  );
};

export default App;
