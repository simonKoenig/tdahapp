import * as React from 'react';
import { AppState, Platform } from 'react-native';
import Navigation from './Navigation';
import { AuthProvider } from './Context/AuthProvider';
import { RewardsProvider } from './Context/RewardsProvider';
import { PatientsProvider } from './Context/PatientsProvider';
import { SubjectsProvider } from './Context/SubjectsProvider';
import { TasksProvider } from './Context/TaskProvider';
import { clearStorage } from './Utils/AsyncStorage';
import { StatusBar } from 'expo-status-bar';

import {
  useFonts,
  AtkinsonHyperlegible_400Regular,
  AtkinsonHyperlegible_700Bold,
} from '@expo-google-fonts/atkinson-hyperlegible';
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
        await clearStorage();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  // Mostrar la pantalla de carga mientras las fuentes no están cargadas
  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <PatientsProvider>
        <TasksProvider>
          <RewardsProvider>
            <SubjectsProvider>
              <StatusBar style="light" backgroundColor="#F9F9F4" />
              <Navigation />
            </SubjectsProvider>
          </RewardsProvider>
        </TasksProvider>
      </PatientsProvider>
    </AuthProvider>
  );
};

export default App;
