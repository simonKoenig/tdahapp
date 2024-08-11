import * as React from 'react';
import Navigation from './Navigation';
import { AuthProvider } from './Context/AuthProvider';
import { RewardsProvider } from './Context/RewardsProvider';
import { PatientsProvider } from './Context/PatientsProvider'; // Importa el PatientProvider


export default function App() {
  return (
    <AuthProvider>
      <PatientsProvider>
        <RewardsProvider>
          <Navigation />
        </RewardsProvider>
      </PatientsProvider>
    </AuthProvider>
  );
}

