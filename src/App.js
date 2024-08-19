import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Rootlayout from './components/rootlayout/Rootlayout';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Register from './components/register/Register';
import GuideRegister from './components/guideRegister/GuideRegister';
import GuiderLogin from './components/guiderLogin/GuiderLogin';
import UserProfile from './components/userProfile/UserProfile';
import GuiderProfile from './components/guiderProfile/GuiderProfile';
import UserLoginStore from './contexts/UserLoginStore';
import PrivateRoute from './components/privateRoute/PrivateRoute';
import GuiderLoginStore from './contexts/guiderLoginStore';
import { GuiderLoginContext } from './contexts/guiderLoginContext';
import GuiderPrivateRoute from './components/guiderPrivateRoute/GuiderPrivateRoute';
import UserPrivateRoute from './components/userPrivateRoute/UserPrivateRoute';

function App() {
  let router = createBrowserRouter([
    {
      path: '/',
      element: <Rootlayout />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: 'user-profile',
          element: <UserPrivateRoute element={<UserProfile />} />
        },
        {
          path: '/register',
          element: <Register />
        },
        {
          path: '/guide-register',
          element: <GuideRegister />
        },
        {
          path: '/guider-login',
          element: <GuiderLogin />
        },
        {
          path: 'guider-profile' ,
          // element: <PrivateRoute element={<GuiderProfile />} />
          element: <GuiderPrivateRoute element={<GuiderProfile />} />
          // element:<GuiderProfile/>
        }
      ]
    }
  ]);

  return (
    <GuiderLoginStore>
    <UserLoginStore>
      <div className="main">
        <RouterProvider router={router} />
      </div>
    </UserLoginStore>
    </GuiderLoginStore>
  );
}

export default App;
