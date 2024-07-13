import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faComments, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-item">
        <FontAwesomeIcon icon={faHome} />
        <span>Home</span>
      </Link>
      <Link to="/chat" className="sidebar-item">
        <FontAwesomeIcon icon={faComments} />
        <span>Chat</span>
      </Link>
      <Link to="/ocr" className="sidebar-item">
        <FontAwesomeIcon icon={faFileAlt} />
        <span>OCR</span>
      </Link>
      <Link to="/pdf" className="sidebar-item">
        <FontAwesomeIcon icon={faFileAlt} />
        <span>PDF</span>
      </Link>
      <Link to="/translate" className="sidebar-item">
        <FontAwesomeIcon icon={faFileAlt} />
        <span>Translate</span>
      </Link>
    </div>
  );
};

export default Sidebar;
