
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from "./components/Navbar";
import Rules from "../src/components/Rules/Rules.jsx";
import Score from "../src/components/Score/Score.jsx";

function Main() {
  const [visibleSection, setVisibleSection] = useState(null);

  return (
    <div className="main-container">
      <Navbar setVisibleSection={setVisibleSection} />
      {visibleSection === "rules" && <Rules onBack={() => setVisibleSection(null)} />}
      {visibleSection === "score" && <Score onBack={() => setVisibleSection(null)} />}
      {visibleSection === null && <App />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the app with the Redux Provider to give it access to the store */}
    <Provider store={store}>
     <Main />
    </Provider>
  </React.StrictMode>
);
