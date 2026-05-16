import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import * as Icons from 'lucide-react';

// Diagnostic for 'Illegal constructor' errors caused by icon namespace collisions
Object.keys(Icons).forEach(key => {
  if ((window as any)[key]) {
    console.warn(`[CineTrack Diagnostic] COLLISION DETECTED: Lucide icon "${key}" conflicts with a browser global. Use "import { ${key} as ${key}Icon } from 'lucide-react'" to fix.`);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
