import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Debug logging
console.log('main.tsx loaded');

// Import your Clerk Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_bmV1dHJhbC13ZXJld29sZi0xMy5jbGVyay5hY2NvdW50cy5kZXYk'

console.log('Clerk Publishable Key:', PUBLISHABLE_KEY ? 'Present' : 'Missing');

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

const rootElement = document.getElementById("root");
console.log('Root element:', rootElement);

if (rootElement) {
  createRoot(rootElement).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
      <App />
    </ClerkProvider>
  );
  console.log('App rendered');
} else {
  console.error('Root element not found!');
}
