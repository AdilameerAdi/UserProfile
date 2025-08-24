import { createContext, useEffect, useMemo, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [authState, setAuthState] = useState({
		isAuthenticated: false,
		role: "user",
		currentUser: null, // { id, name, email, role }
		isLoading: true,
	});

	// Load initial session and subscribe to auth changes
	useEffect(() => {
		let isMounted = true;

		const loadSession = async () => {
			const { data: sessionData, error } = await supabase.auth.getSession();
			if (error) {
				if (isMounted) setAuthState((prev) => ({ ...prev, isAuthenticated: false, currentUser: null, role: "user", isLoading: false }));
				return;
			}
			const session = sessionData?.session;
			const user = session?.user || null;
			if (!user) {
				if (isMounted) setAuthState((prev) => ({ ...prev, isAuthenticated: false, currentUser: null, role: "user", isLoading: false }));
				return;
			}

			const profile = await fetchUserProfile(user.id);
			if (isMounted) {
				setAuthState({
					isAuthenticated: true,
					role: profile?.is_admin ? "admin" : "user",
					currentUser: {
						id: user.id,
						name: profile?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
						email: user.email || "",
						role: profile?.is_admin ? "admin" : "user",
					},
					isLoading: false,
				});
			}
		};

		loadSession();

		const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
			const nextUser = session?.user || null;
			if (!nextUser) {
				setAuthState({ isAuthenticated: false, role: "user", currentUser: null, isLoading: false });
				return;
			}
			const profile = await fetchUserProfile(nextUser.id);
			setAuthState({
				isAuthenticated: true,
				role: profile?.is_admin ? "admin" : "user",
				currentUser: {
					id: nextUser.id,
					name: profile?.full_name || nextUser.user_metadata?.name || nextUser.email?.split("@")[0] || "User",
					email: nextUser.email || "",
					role: profile?.is_admin ? "admin" : "user",
				},
				isLoading: false,
			});
		});

		return () => {
			isMounted = false;
			authListener.subscription.unsubscribe();
		};
	}, []);

	const fetchUserProfile = async (userId) => {
		const { data, error } = await supabase
			.from("profiles")
			.select("id, full_name, is_admin")
			.eq("id", userId)
			.single();
		if (error) return null;
		return data;
	};

	const loginCredentials = async ({ emailOrName, password, isAdmin = false }) => {
		if (isAdmin) {
			// Fallback admin login (legacy). Prefer using profile.is_admin for real admin accounts.
			if (emailOrName === "Adil" && password === "Adil") {
				setAuthState({
					isAuthenticated: true,
					role: "admin",
					currentUser: { id: "admin", name: "Adil", email: "", role: "admin" },
					isLoading: false,
				});
				return { ok: true };
			}
			// Fall through to standard login if legacy creds not used
		}

		const { data, error } = await supabase.auth.signInWithPassword({ email: emailOrName, password });
		if (error) return { ok: false, error: error.message || "Invalid email or password" };

		const user = data?.user;
		if (!user) return { ok: false, error: "Login failed" };

		const profile = await fetchUserProfile(user.id);
		setAuthState({
			isAuthenticated: true,
			role: profile?.is_admin ? "admin" : "user",
			currentUser: {
				id: user.id,
				name: profile?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
				email: user.email || "",
				role: profile?.is_admin ? "admin" : "user",
			},
			isLoading: false,
		});
		return { ok: true };
	};

	const register = async ({ name, email, password }) => {
		if (!name || !email || !password) {
			return { ok: false, error: "All fields are required" };
		}
		const { data, error } = await supabase.auth.signUp({ email, password });
		if (error) return { ok: false, error: error.message };

		let user = data?.user || null;

		// Create or update profile with name (do not include email column as it may not exist in schema)
		if (user) {
			await supabase.from("profiles").upsert({ id: user.id, full_name: name });
		}

		// If no session (e.g., email confirm required), try to sign in directly for dev
		if (!data?.session) {
			const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });
			user = signInData?.user || user;
		}

		if (user) {
			const profile = await fetchUserProfile(user.id);
			setAuthState({
				isAuthenticated: true,
				role: profile?.is_admin ? "admin" : "user",
				currentUser: {
					id: user.id,
					name: profile?.full_name || name,
					email: user.email || email,
					role: profile?.is_admin ? "admin" : "user",
				},
				isLoading: false,
			});
		}

		return { ok: true };
	};

	const updateProfileName = async (newName) => {
		const userId = authState.currentUser?.id;
		if (!userId) return { ok: false, error: "No authenticated user" };
		const { error } = await supabase.from("profiles").update({ full_name: newName }).eq("id", userId);
		if (error) return { ok: false, error: error.message };
		setAuthState((prev) => ({
			...prev,
			currentUser: prev.currentUser ? { ...prev.currentUser, name: newName } : prev.currentUser,
		}));
		return { ok: true };
	};

	const updateEmail = async (newEmail) => {
		if (!newEmail) return { ok: false, error: "Email required" };
		const { data, error } = await supabase.auth.updateUser({ email: newEmail });
		if (error) return { ok: false, error: error.message };
		const user = data?.user;
		if (user) {
			setAuthState((prev) => ({
				...prev,
				currentUser: prev.currentUser ? { ...prev.currentUser, email: user.email || newEmail } : prev.currentUser,
			}));
		}
		return { ok: true };
	};

	const updatePassword = async (newPassword) => {
		if (!newPassword) return { ok: false, error: "Password required" };
		const { error } = await supabase.auth.updateUser({ password: newPassword });
		if (error) return { ok: false, error: error.message };
		return { ok: true };
	};

	const logout = async () => {
		await supabase.auth.signOut();
		setAuthState({ isAuthenticated: false, role: "user", currentUser: null, isLoading: false });
	};

	const value = useMemo(
		() => ({
			isAuthenticated: authState.isAuthenticated,
			role: authState.role,
			isAdmin: authState.role === "admin",
			currentUser: authState.currentUser,
			isLoading: authState.isLoading,
			loginCredentials,
			register,
			logout,
			updateProfileName,
			updateEmail,
			updatePassword,
		}),
		[authState]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	return useContext(AuthContext);
}
