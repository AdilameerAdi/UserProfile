import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

const USERS_KEY = "appUsers_v1";

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (_) {}
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ isAuthenticated: false, role: "user", user: null });
  const [users, setUsers] = useState(loadUsers);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  const login = (role = "user", user = null) => setAuth({ isAuthenticated: true, role, user });
  const logout = () => setAuth({ isAuthenticated: false, role: "user", user: null });

  const register = ({ name, email, password }) => {
    const emailLower = (email || "").trim().toLowerCase();
    if (!emailLower || !password) {
      return { ok: false, error: "Missing email or password" };
    }
    if (users.find((u) => u.email === emailLower)) {
      return { ok: false, error: "Email already registered" };
    }
    const newUser = { id: crypto.randomUUID(), name: name || "Player", email: emailLower, password };
    const next = [...users, newUser];
    setUsers(next);
    return { ok: true, user: newUser };
  };

  const loginWithEmail = ({ email, password }) => {
    const emailLower = (email || "").trim().toLowerCase();
    const user = users.find((u) => u.email === emailLower && u.password === password);
    if (!user) return { ok: false, error: "Invalid email or password" };
    login("user", user);
    return { ok: true, user };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: auth.isAuthenticated, role: auth.role, isAdmin: auth.role === "admin", user: auth.user, users, register, loginWithEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
