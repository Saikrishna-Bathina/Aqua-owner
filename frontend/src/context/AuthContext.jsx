import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check localStorage for token (runs once)
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("username");
    if (token) {
      setIsAuthenticated(true);
      setUsername(name);
    }
  }, []);

  const login = (token, name) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", name);
    setIsAuthenticated(true);
    setUsername(name);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
