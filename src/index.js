import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {PdfProvider} from '../src/context/PdfContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <PdfProvider>
    <App />
    </PdfProvider>
  </React.StrictMode>
);

