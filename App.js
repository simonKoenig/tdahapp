import * as React from 'react';
import Navigation from './Navigation';
import { AuthProvider } from './Context/AuthProvider'; // Asegúrate de que la ruta sea correcta

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}

