import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ShelterProvider } from './utils/ShelterContext.tsx'
import { PreferencesProvider } from './utils/PreferencesContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShelterProvider>
      <PreferencesProvider>
        <App />
      </PreferencesProvider>
    </ShelterProvider>
  </StrictMode>,
)
