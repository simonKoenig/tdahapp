import * as React from 'react';
import { AppState, Alert, Platform } from 'react-native';
import Navigation from './Navigation';
import { AuthProvider } from './Context/AuthProvider';
import { RewardsProvider } from './Context/RewardsProvider';
import { PatientsProvider } from './Context/PatientsProvider'; // Importa el PatientProvider
import { SubjectsProvider } from './Context/SubjectsProvider'; // Importa el SubjectsProvider
import { TasksProvider } from './Context/TaskProvider';
import { clearStorage } from './Utils/AsyncStorage';
import messaging from '@react-native-firebase/messaging';
import { setupNotificationListeners, setupBackgroundHandler } from './Utils/NotificationService';
import { useFonts, AtkinsonHyperlegible_400Regular, AtkinsonHyperlegible_400Regular_Italic, AtkinsonHyperlegible_700Bold, AtkinsonHyperlegible_700Bold_Italic, } from '@expo-google-fonts/atkinson-hyperlegible';
import LoadingScreen from './Components/LoadingScreen';

const App = () => {
  const [fontsLoaded] = useFonts({
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
  });
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
    // Configurar listeners globales de notificaciones (solo en móviles)
    if (Platform.OS === 'web') return;

    const unsubscribeOnMessage = setupNotificationListeners();
    setupBackgroundHandler(); // Configurar el handler en segundo plano

    // Limpiar los listeners cuando el componente se desmonte
    return () => {
      unsubscribeOnMessage();
    };
  }, []);

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

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