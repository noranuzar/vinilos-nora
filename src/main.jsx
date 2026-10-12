import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { CatalogoProvider } from './context/CatalogoContext'
import { CestaProvider } from './context/CestaContext'
import { DisenoProvider } from './context/DisenoContext'
import App from './App'
import './styles/global.css'

// En Vercel se usan URLs normales; la vista previa de un solo archivo usa #/ruta.
const Router = import.meta.env.VITE_ROUTER === 'hash' ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <CatalogoProvider>
        <CestaProvider>
          <DisenoProvider>
            <App />
          </DisenoProvider>
        </CestaProvider>
      </CatalogoProvider>
    </Router>
  </StrictMode>
)
