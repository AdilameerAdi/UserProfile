import { createContext, useEffect, useMemo, useState, useContext } from "react";

const AUTH_STORE_KEY = "auth_store_v1";

const AuthContext = createContext();

const defaultAuth = {
	isAuthenticated: false,
	role: "user",
	currentUser: null, // { name, email, role }
	users: [], // [{ name, email, password, role }]
};

export function AuthProvider({ children }) {
	const [auth, setAuth] = useState(() => {
		try {
			const raw = localStorage.getItem(AUTH_STORE_KEY);
			return raw ? JSON.parse(raw) : defaultAuth;
		} catch (_) {
			return defaultAuth;
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(AUTH_STORE_KEY, JSON.stringify(auth));
		} catch (_) {
			// ignore persistence errors
		}
	}, [auth]);

	const login = (role = "user") =>
		setAuth((prev) => ({ ...prev, isAuthenticated: true, role, currentUser: role === "admin" ? { name: "Adil", email: "", role: "admin" } : prev.currentUser }));

	const loginCredentials = ({ emailOrName, password, isAdmin = false }) => {
		if (isAdmin) {
			if (emailOrName === "Adil" && password === "Adil") {
				setAuth({ ...auth, isAuthenticated: true, role: "admin", currentUser: { name: "Adil", email: "", role: "admin" } });
				return { ok: true };
			}
			return { ok: false, error: "Invalid admin credentials" };
		}

		const found = auth.users.find((u) => (u.email === emailOrName || u.name === emailOrName) && u.password === password);
		if (found) {
			setAuth({ ...auth, isAuthenticated: true, role: found.role || "user", currentUser: { name: found.name, email: found.email, role: found.role || "user" } });
			return { ok: true };
		}
		return { ok: false, error: "Invalid email or password" };
	};

	const register = ({ name, email, password }) => {
		if (!name || !email || !password) {
			return { ok: false, error: "All fields are required" };
		}
		const exists = auth.users.some((u) => u.email === email);
		if (exists) {
			return { ok: false, error: "Email already registered" };
		}
		const newUser = { name, email, password, role: "user" };
		setAuth((prev) => ({
			...prev,
			users: [...prev.users, newUser],
			isAuthenticated: true,
			role: "user",
			currentUser: { name, email, role: "user" },
		}));
		return { ok: true };
	};

	const logout = () => setAuth((prev) => ({ ...prev, isAuthenticated: false, role: "user", currentUser: null }));

	const value = useMemo(
		() => ({
			isAuthenticated: auth.isAuthenticated,
			role: auth.role,
			isAdmin: auth.role === "admin",
			currentUser: auth.currentUser,
			users: auth.users,
			login,
			loginCredentials,
			register,
			logout,
		}),
		[auth]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	return useContext(AuthContext);
}
