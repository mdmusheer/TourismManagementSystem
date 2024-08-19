
import React from 'react';
import Navbar from '../navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../footer/Footer';
import './Rootlayout.css'; // Import CSS file for styling

function Rootlayout() {
  return (
    <div className="root-layout">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Rootlayout;
