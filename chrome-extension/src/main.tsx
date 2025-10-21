import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './side_panel/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
