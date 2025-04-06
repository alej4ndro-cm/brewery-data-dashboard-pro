import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom' // cambia esto
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter> {/* cambia esto */}
      <App />
    </HashRouter>
  </React.StrictMode>
)
