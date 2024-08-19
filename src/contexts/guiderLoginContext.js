

import { createContext } from "react";

// Initialize context with default values representing initial state
export const GuiderLoginContext = createContext({
  GuiderLoggedinUser: {},
  GuiderLoginStatus: false,
  GuiderLoginErr: "",
  GuiderLoginuserFunc: () => {},
  GuiderLogoutUserFunc: () => {}
});
