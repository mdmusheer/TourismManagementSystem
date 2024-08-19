import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import GuiderLoginStore from '../../contexts/guiderLoginStore';
import { GuiderLoginContext } from '../../contexts/guiderLoginContext';
import './PrivateRoute.css'; // Import the CSS file


const NotAuthenticatedModal = ({ handleLoginClick }) => {
  return (
    <div className="modal-container">
      <div className="modal-content">
        <h1 className="modal-header">Please Log In First</h1>
        <p className="modal-text">You need to be logged in to access this page.</p>
        <button onClick={handleLoginClick} className="modal-button">
          Log In
        </button>
      </div>
    </div>
  );
};

const PrivateRoute = ({ element, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { GuiderLoginStatus } = useContext(GuiderLoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (GuiderLoginStatus) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(GuiderLoginStatus);
    }
  }, [GuiderLoginStatus]);


  const handleLoginClick = () => {
    navigate('/guider-login');
  };

  return isAuthenticated ? (
    element
  ) : (
    <>
      {element}
      <NotAuthenticatedModal handleLoginClick={handleLoginClick} />
    </>
  );
};

export default PrivateRoute;
