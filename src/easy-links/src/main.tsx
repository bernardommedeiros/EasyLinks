import { createRoot } from 'react-dom/client'
import '@/globals.css'
import App from '@/App'
import { AuthProvider } from '@/context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
