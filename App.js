import * as React from 'react';
import { AppState } from 'react-native';
import Navigation from './Navigation';
import { AuthProvider } from './Context/AuthProvider';
import { RewardsProvider } from './Context/RewardsProvider';
import { PatientsProvider } from './Context/PatientsProvider'; // Importa el PatientProvider
import { SubjectsProvider } from './Context/SubjectsProvider'; // Importa el SubjectsProvider
import { TasksProvider } from './Context/TaskProvider';
import { clearStorage } from './Utils/AsyncStorage';

const App = () => {
  //Limpia el almacenamiento cuando la aplicación pasa a segundo plano o se cierra
  React.useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        clearStorage();
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
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
}

export default App;