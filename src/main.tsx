
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Import your Clerk Publishable Key
const PUBLISHABLE_KEY = 'pk_test_bmV1dHJhbC13ZXJld29sZi0xMy5jbGVyay5hY2NvdW50cy5kZXYk'

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
    <App />
  </ClerkProvider>
);
