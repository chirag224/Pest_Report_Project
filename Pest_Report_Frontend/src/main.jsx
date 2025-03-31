// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Your global CSS import
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios'; // <<< 1. Import axios

// --- 2. Add this section to configure Axios Base URL ---
const apiUrl = import.meta.env.VITE_API_URL; // Reads variable set in Render ENV during build

if (apiUrl) {
  // Sets the base URL for ALL subsequent axios requests in your app
  axios.defaults.baseURL = apiUrl;
  console.log(`[main.jsx] Axios Base URL set by VITE_API_URL to: ${apiUrl}`);
} else {
  // This warning appears if VITE_API_URL wasn't set during build
  console.warn('[main.jsx] VITE_API_URL is not set! API calls in production might fail. Check Render ENV vars & trigger a clean frontend build.');
  // You might have relied on the proxy locally, so no explicit fallback URL is needed here usually.
}
// ----------------------------------------------------

// --- 3. Your existing ReactDOM rendering logic ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);