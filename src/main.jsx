import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext";
import "./index.css";

// Add global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Show a basic error message if React fails to load
  const root = document.getElementById('root');
  if (root && root.children.length <= 1) {
    root.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #111; color: white; text-align: center; padding: 20px;">
        <div>
          <h2 style="color: #ef4444; margin-bottom: 16px;">Application Error</h2>
          <p style="margin-bottom: 20px;">The app failed to load. Please check the console for details.</p>
          <button onclick="window.location.reload()" style="padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
});

try {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <ThemeProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render React app:', error);
}
