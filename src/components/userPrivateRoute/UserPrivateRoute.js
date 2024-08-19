import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { loginContext } from '../../contexts/logincontext';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import UserLoginStore from '../../contexts/UserLoginStore';
import GuiderLoginStore from '../../contexts/guiderLoginStore';
import './UserPrivateRoute.css'; // Import the CSS filea
import { GuiderLoginContext } from '../../contexts/guiderLoginContext';

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
  const { userLoginStatus } = useContext(loginContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
    if (userLoginStatus) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(userLoginStatus);
    }
  }, [userLoginStatus]);


  const handleLoginClick = () => {
    navigate('/login');
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
