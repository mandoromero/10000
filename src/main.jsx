
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the app with the Redux Provider to give it access to the store */}
    <Provider store={store}>
     <App />
    </Provider>
  </React.StrictMode>
);
