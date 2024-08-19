import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TourVista from '../images/TourVista.png';
import './Navbar.css';
import { GuiderLoginContext } from '../../contexts/guiderLoginContext';
import { loginContext } from '../../contexts/logincontext';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Import icon for fallback

function Navbar() {
  const { LoggedinUser, userLoginStatus, logoutUserFunc } = useContext(loginContext);
  const { LoggedInGuider, GuiderLoginStatus, GuiderLogoutUserFunc } = useContext(GuiderLoginContext);
  const [activeLink, setActiveLink] = useState('/');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the active link from local storage on component mount
    const storedActiveLink = localStorage.getItem('activeLink');
    if (storedActiveLink) {
      setActiveLink(storedActiveLink);
    }

    // Retrieve the profile details from local storage
    const storedUser = localStorage.getItem('profile-details');
    const storedGuider = localStorage.getItem('Guider-profile-details');
    if (GuiderLoginStatus && storedGuider) {
      setUserDetails(JSON.parse(storedGuider));
    } else if (userLoginStatus && storedUser) {
      setUserDetails(JSON.parse(storedUser));
    }
  }, [GuiderLoginStatus, userLoginStatus]);

  useEffect(() => {
    // Store the user details in local storage whenever they change
    if (userDetails) {
      localStorage.setItem('profile-details', JSON.stringify(userDetails));
    }
  }, [userDetails]);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    localStorage.setItem('activeLink', link); // Save the active link to local storage
  };

  const getNavLinkClass = (link) => {
    return link === activeLink ? 'nav-link active' : 'nav-link';
  };

  const navbarBackgroundColor = "#40E0D0";

  return (
    <nav className={`navbar navbar-expand-lg custom-navbar navbar-${navbarBackgroundColor} bg-${navbarBackgroundColor}`}>
      <div className="container">
        <img src={TourVista} alt='journeylogo' style={{ height: 60, width: 70, borderRadius: 80 }} />
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={getNavLinkClass('/')} to="/" onClick={() => handleLinkClick('/')}>Home</Link>
            </li>
            {!userLoginStatus && !GuiderLoginStatus ? (
              <>
                <li className="nav-item">
                  <Link className={getNavLinkClass('/register')} to="/register" onClick={() => handleLinkClick('/register')}>Register</Link>
                </li>
                <li className="nav-item">
                  <Link className={getNavLinkClass('/login')} to="/login" onClick={() => handleLinkClick('/login')}>Login</Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <div className="profile-icon" onClick={() => setShowProfileMenu(!showProfileMenu)}>    
                  <FaUserCircle className="fa-user-circle" />
                </div>
                {showProfileMenu && (
                  <div className="profile-menu">
                    <div className="profile-header">
                      {userDetails && userDetails.image ? (
                        <img
                          src={userDetails.image}
                          alt='profile'
                          className="profile-image-small"
                        />
                      ) : (
                        <FaUserCircle className="fa-user-circle" />
                      )}
                    </div>
                    <div className="profile-details">
                      <p><strong>Name:</strong> {userDetails ? userDetails.name : ''}</p>
                      <p><strong>Email:</strong> {userDetails ? userDetails.Email : ''}</p>
                    </div>
                    <button onClick={() => {
                      if (userLoginStatus) {
                        logoutUserFunc();
                        navigate('/login');
                      } else if (GuiderLoginStatus) {
                        GuiderLogoutUserFunc();
                        navigate('/guider-login');
                      }
                      setShowProfileMenu(false);
                      handleLinkClick('/login');
                    }}>Logout</button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

















// import React, { useContext, useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import journeyLogo2 from '../images/journeyLogo3.png';
// import './Navbar.css';
// import { GuiderLoginContext } from '../../contexts/guiderLoginContext';
// import { loginContext } from '../../contexts/logincontext';
// import GuiderLogin from '../guiderLogin/GuiderLogin';
// import { useNavigate } from 'react-router-dom';
// import { FaUserCircle } from 'react-icons/fa'; // Import icon for fallback

// function Navbar() {
//   const { LoggedinUser, userLoginStatus, logoutUserFunc } = useContext(loginContext);
//   const { LoggedInGuider, GuiderLoginStatus, GuiderLogoutUserFunc } = useContext(GuiderLoginContext);
//   const [activeLink, setActiveLink] = useState(null);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [userDetails, setUserDetails] = useState(null);

//   const navigate=useNavigate()

//   useEffect(() => {
//     // Retrieve the profile details from local storage on component mount
//     const storedUser = localStorage.getItem('profile-details');
//     const storedGuider = localStorage.getItem('Guider-profile-details');
//     if (GuiderLoginStatus && storedGuider) {
//       setUserDetails(JSON.parse(storedGuider));
//     } else if (userLoginStatus && storedUser) {
//       setUserDetails(JSON.parse(storedUser));
//     }
//   }, [LoggedinUser, userLoginStatus, GuiderLoginStatus]);


//   useEffect(() => {
//     // Store the user details in local storage whenever they change
//     if (userDetails) {
//       localStorage.setItem('profile-details', JSON.stringify(userDetails));
//     }
//     console.log("user details are", userDetails);
//   }, [userDetails]);

//   const handleLinkClick = (link) => {
//     setActiveLink(link);
//   };

//   const getNavLinkClass = (link) => {
//     return link === activeLink ? 'nav-link active' : 'nav-link';
//   };

//   const navbarBackgroundColor = "#40E0D0";

//   return (
//     <nav className={`navbar navbar-expand-lg custom-navbar navbar-${navbarBackgroundColor} bg-${navbarBackgroundColor}`}>
//       <div className="container">
//         <img src={journeyLogo2} alt='journeylogo' style={{ height: 50, width: 60, borderRadius: 50 }} />
//         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav ms-auto">
//             <li className="nav-item">
//               <Link className={getNavLinkClass('/')} to="/" onClick={() => handleLinkClick('/')}>Home</Link>
//             </li>
//             {!userLoginStatus && !GuiderLoginStatus ? (
//               <>
//                 <li className="nav-item">
//                   <Link className={getNavLinkClass('/register')} to="/register" onClick={() => handleLinkClick('/register')}>Register</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className={getNavLinkClass('/login')} to="/login" onClick={() => handleLinkClick('/login')}>Login</Link>
//                 </li>
//               </>
//             ) : (
//               <li className="nav-item dropdown">
//                 <div className="profile-icon" onClick={() => setShowProfileMenu(!showProfileMenu)}>    
//                   <FaUserCircle className="fa-user-circle" />
//                 </div>
//                 {showProfileMenu && (
//                   <div className="profile-menu">
//                     <div className="profile-header">
//                       {userDetails && userDetails.image ? (
//                         <img
//                           src={userDetails.image}
//                           alt='profile'
//                           className="profile-image-small"
//                         />
//                       ) : (
//                         <FaUserCircle className="fa-user-circle" />
//                       )}
//                     </div>
//                     <div className="profile-details">
//                       <p><strong>Name:</strong> {userDetails ? userDetails.name : ''}</p>
//                       <p><strong>Email:</strong> {userDetails ? userDetails.Email : ''}</p>
//                     </div>
//                     <button onClick={() => {
//                       if (userLoginStatus) {
//                         logoutUserFunc();
//                         navigate('/login');
//                       } else if (GuiderLoginStatus) {
//                         GuiderLogoutUserFunc();
//                         navigate('/guider-login');
//                       }
//                       setShowProfileMenu(false);
//                       handleLinkClick('/login');
//                     }}>Logout</button>
//                   </div>
//                 )}
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;
