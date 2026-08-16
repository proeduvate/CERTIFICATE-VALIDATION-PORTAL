import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Order matters: tokens define the variables, base consumes them, components
// build on both. Page stylesheets are imported by the pages themselves.
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/motion.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
