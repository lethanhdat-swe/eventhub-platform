import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import App from '@/App.jsx';
import '@/styles/global.css';
import '@/styles/container.css';
import '@/styles/_variables.css';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import AuthBootstrap from '@/components/AuthBootstrap/AuthBootstrap';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <BrowserRouter>
    <MantineProvider>
      <AuthBootstrap>
        <App />
        <ScrollToTop />
      </AuthBootstrap>
    </MantineProvider>
  </BrowserRouter>
  // </StrictMode>
);
