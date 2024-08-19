import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GuiderLoginStore from '../../contexts/guiderLoginStore';
import { GuiderLoginContext } from '../../contexts/guiderLoginContext';
import './GuiderPrivateRoute.css';


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

const GuiderPrivateRoute = ({ element }) => {
  const { GuiderLoginStatus } = useContext(GuiderLoginContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (GuiderLoginStatus) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [GuiderLoginStatus]);

  const handleLoginClick = () => {
    navigate('/guider-login');
  };

  return isAuthenticated ? (
    element
  ) : (
    <>
      <NotAuthenticatedModal handleLoginClick={handleLoginClick} />
    </>
  );
};

export default GuiderPrivateRoute;
