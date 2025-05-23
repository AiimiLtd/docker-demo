import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18
import App from './App.js';

// Data injected by the server during SSR
const initialData = window.__INITIAL_DATA__;
delete window.__INITIAL_DATA__; // Clean up

const root = ReactDOM.hydrateRoot( // Use hydrateRoot for SSR
  document.getElementById('root'),
  <App initialData={initialData ? initialData.message : undefined} />
);