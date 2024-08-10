import * as React from 'react';
import Navigation from './Navigation';
import { AuthProvider } from './Context/AuthProvider';
import { RewardsProvider } from './Context/RewardsProvider';

export default function App() {
  return (
    <AuthProvider>
      <RewardsProvider>
        <Navigation />
      </RewardsProvider>
    </AuthProvider>
  );
}

