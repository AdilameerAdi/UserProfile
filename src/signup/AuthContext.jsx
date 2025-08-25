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

	// Cache for user profiles to avoid repeated DB calls
	const profileCache = useMemo(() => new Map(), []);

	// Load initial session and subscribe to auth changes
	useEffect(() => {
		let isMounted = true;

		const loadSession = async () => {
			try {
				// Clear all browser storage related to authentication
				localStorage.clear();
				sessionStorage.clear();
				
				// Clear profile cache
				profileCache.clear();
				
				// Always clear any existing session on app start
				await supabase.auth.signOut();
				
				if (!isMounted) return;
				
				// Always start unauthenticated - force fresh login
				setAuthState({ isAuthenticated: false, currentUser: null, role: "user", isLoading: false });
			} catch {
				if (isMounted) {
					// Clear storage even if signOut fails
					localStorage.clear();
					sessionStorage.clear();
					profileCache.clear();
					setAuthState({ isAuthenticated: false, currentUser: null, role: "user", isLoading: false });
				}
			}
		};

		// Clear session on app start
		loadSession();

		// Listen for auth changes (login, logout, etc)
		const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
			// Skip initial session since we handle it in loadSession
			if (event === 'INITIAL_SESSION') return;
			
			const nextUser = session?.user || null;
			if (!nextUser) {
				setAuthState({ isAuthenticated: false, role: "user", currentUser: null, isLoading: false });
				return;
			}
			
			// Set authenticated state immediately for faster UI
			setAuthState({
				isAuthenticated: true,
				role: "user", // Default to user, will update if admin
				currentUser: {
					id: nextUser.id,
					name: nextUser.user_metadata?.name || nextUser.email?.split("@")[0] || "User",
					email: nextUser.email || "",
					role: "user",
				},
				isLoading: false,
			});

			// Fetch profile in background and update if needed
			const profile = await fetchUserProfile(nextUser.id);
			if (profile?.is_admin) {
				setAuthState(prev => ({
					...prev,
					role: "admin",
					currentUser: {
						...prev.currentUser,
						name: profile.full_name || prev.currentUser.name,
						role: "admin",
					}
				}));
			} else if (profile?.full_name) {
				setAuthState(prev => ({
					...prev,
					currentUser: {
						...prev.currentUser,
						name: profile.full_name,
					}
				}));
			}
		});

		return () => {
			isMounted = false;
			authListener.subscription.unsubscribe();
		};
	}, []);

	const fetchUserProfile = async (userId) => {
		// Check cache first
		if (profileCache.has(userId)) {
			return profileCache.get(userId);
		}

		const { data, error } = await supabase
			.from("profiles")
			.select("id, full_name, is_admin, recovery_email")
			.eq("id", userId)
			.single();
		
		if (error) return null;
		
		// Cache the result
		profileCache.set(userId, data);
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

		try {
			// Check if input looks like an email format
			const isValidEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrName);
			
			if (isValidEmailFormat) {
				// Try primary email login first (most common case)
				const loginResult = await supabase.auth.signInWithPassword({ 
					email: emailOrName, 
					password: password 
				});
				
				if (!loginResult.error) {
					// Success with primary email
					const user = loginResult.data?.user;
					if (user) return { ok: true };
				}
				
				// If primary email failed, try recovery email
				// This runs in parallel with a timeout for faster response
				const rpcPromise = supabase.rpc('login_with_recovery_email', {
					recovery_email: emailOrName,
					password_input: password
				});
				
				// Add timeout to prevent hanging
				const timeoutPromise = new Promise((_, reject) => 
					setTimeout(() => reject(new Error('Recovery check timeout')), 3000)
				);
				
				try {
					const { data: rpcResult, error: rpcError } = await Promise.race([
						rpcPromise,
						timeoutPromise
					]);
					
					if (!rpcError && rpcResult?.success && rpcResult?.primary_email) {
						// Login with the primary email from recovery
						const { data: primaryLoginData } = await supabase.auth.signInWithPassword({ 
							email: rpcResult.primary_email, 
							password: password 
						});
						
						if (primaryLoginData?.user) {
							return { ok: true };
						}
					}
				} catch {
					// If recovery email check times out, just return the original error
					// Silent fail in production
				}
				
				// Neither primary nor recovery worked
				return { ok: false, error: "Invalid email or password" };
			} else {
				// Not a valid email format (might be username for admin)
				return { ok: false, error: "Please enter a valid email address" };
			}

			// The auth state will be updated by the onAuthStateChange listener
			// We just need to return success here
			return { ok: true };
		} catch (err) {
			return { ok: false, error: "Login failed. Please check your credentials." };
		}
	};

	const register = async ({ name, email, password }) => {
		if (!name || !email || !password) {
			return { ok: false, error: "All fields are required" };
		}
		
		try {
			// Sign up the user
			const { data, error } = await supabase.auth.signUp({ 
				email, 
				password,
				options: {
					data: {
						full_name: name,
					}
				}
			});
			
			if (error) {
				return { ok: false, error: error.message };
			}
			
			let user = data?.user || null;
			
			// Create or update profile with name
			if (user) {
				await supabase
					.from("profiles")
					.upsert({ 
						id: user.id, 
						full_name: name 
					});
			}
			
			// If no session (e.g., email confirm required), try to sign in directly
			if (!data?.session && user) {
				const { data: signInData } = await supabase.auth.signInWithPassword({ 
					email, 
					password 
				});
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
		} catch {
			return { ok: false, error: "Registration failed. Please try again." };
		}
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
		// Clear profile cache immediately
		profileCache.clear();
		
		// Update auth state immediately (don't wait for Supabase)
		setAuthState({ isAuthenticated: false, role: "user", currentUser: null, isLoading: false });
		
		// Try to sign out from Supabase in background
		try {
			// Add timeout to prevent hanging
			const signOutPromise = supabase.auth.signOut();
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error('Signout timeout')), 3000)
			);
			
			await Promise.race([signOutPromise, timeoutPromise]);
		} catch {
			// Continue anyway since we already cleared local state
		}
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