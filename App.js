import * as React from 'react';
import Navigation from './Navigation';
import { AuthProvider } from './Context/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}

