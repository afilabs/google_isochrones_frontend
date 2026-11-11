import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import HomePage from './pages/HomePage';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

function App() {
  return (
    <APIProvider apiKey={API_KEY}>
      <HomePage />
    </APIProvider>
  );
}

export default App;
