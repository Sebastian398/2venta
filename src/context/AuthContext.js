"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const emailActivo = localStorage.getItem("usuarioActivoEmail");
    setIsAuthenticated(!!emailActivo);
  }, []);

  const login = (email) => {
    localStorage.setItem("usuarioActivoEmail", email);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("usuarioActivoEmail");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
