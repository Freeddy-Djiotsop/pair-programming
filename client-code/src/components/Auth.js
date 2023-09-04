import { useState, createContext, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") !== null
  );
  const [user, setUser] = useState(null);

  const login = () => {
    const tmp = localStorage.getItem("token") !== null;
    setIsAuthenticated(tmp);
    const uTmp = JSON.parse(localStorage.getItem("user"))["user"];
    console.log(uTmp);
    setUser(uTmp);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
