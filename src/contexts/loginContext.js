

import { createContext } from "react";

// Initialize context with default values representing initial state
export const loginContext = createContext({
  LoggedinUser: {},
  userLoginStatus: false,
  loginErr: "",
  loginuserFunc: () => {},
  logoutUserFunc: () => {}
});
