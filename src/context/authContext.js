import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";
const initialState = { user: null };

// authorization verification
if (localStorage.getItem("access-token")) {
  const decodedToken = jwtDecode(localStorage.getItem("access-token"));
  if (decodedToken * 1000 < Date.now()) {
    localStorage.removeItem("access-token");
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

function authReducer(state, action) {
  console.log(action);
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.user,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    localStorage.setItem("access-token", userData.token);
    dispatch({
      type: "LOGIN",
      user: userData,
    });
  }

  function logout() {
    localStorage.removeItem("access-token");
    dispatch({
      type: "LOGOUT",
    });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
