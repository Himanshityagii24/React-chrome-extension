// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import ChatPage from './components/ChatPage';
import OCRPage from './components/OCRPage';
import Pdf from './components/Pdf';
import Translate from './components/Translate';

function App() {
  return (
    <Router>
      <div className='grid-container'>
        <Sidebar />
        <div className='main-content'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/ocr" element={<OCRPage />} />
            <Route path="/pdf" element={<Pdf />} />
            <Route path="/translate" element={<Translate />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
