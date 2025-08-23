import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ isAuthenticated: false, role: "user" });

  const login = (role = "user") => setAuth({ isAuthenticated: true, role });
  const logout = () => setAuth({ isAuthenticated: false, role: "user" });

  return (
    <AuthContext.Provider value={{ isAuthenticated: auth.isAuthenticated, role: auth.role, isAdmin: auth.role === "admin", login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
