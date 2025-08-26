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
			
			// Set loading state first
			setAuthState({ isAuthenticated: false, role: "user", currentUser: null, isLoading: true });
			
			// Clear cache and fetch fresh profile data during login
			profileCache.delete(nextUser.id);
			const profile = await fetchUserProfile(nextUser.id);
			
			// Ensure proper role assignment - only true admin accounts should have admin role
			const isUserAdmin = profile?.is_admin === true;
			
			// Set authenticated state with complete profile data
			setAuthState({
				isAuthenticated: true,
				role: isUserAdmin ? "admin" : "user",
				currentUser: {
					id: nextUser.id,
					name: profile?.full_name || nextUser.user_metadata?.name || nextUser.email?.split("@")[0] || "User",
					email: nextUser.email || "",
					profilePicture: profile?.profile_picture,
					coins: profile?.coins || 0,
					role: isUserAdmin ? "admin" : "user",
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
		// Check cache first
		if (profileCache.has(userId)) {
			return profileCache.get(userId);
		}

		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", userId)
			.single();
		
		if (error) {
			console.error("Database error fetching profile:", error);
			return null;
		}
		
		// Cache the result
		profileCache.set(userId, data);
		return data;
	};


	const loginCredentials = async ({ emailOrName, password, isAdmin = false }) => {
		
		if (isAdmin) {
			// Use database admin authentication
			try {
				const { data, error } = await supabase.rpc('verify_admin_login', {
					input_username: emailOrName,
					input_password: password
				});

				if (error) {
					console.error('Database error during admin login:', error);
					return { ok: false, error: `Login failed: ${error.message}` };
				}

				if (data?.success) {
					const adminInfo = data.admin;
					setAuthState({
						isAuthenticated: true,
						role: "admin",
						currentUser: { 
							id: adminInfo.id, 
							name: adminInfo.username, 
							email: "", 
							role: "admin",
							lastLogin: adminInfo.last_login
						},
						isLoading: false,
					});
					return { ok: true };
				} else {
					return { ok: false, error: data?.error || 'Invalid admin credentials' };
				}
			} catch (error) {
				console.error('Error during admin login:', error);
				return { ok: false, error: 'Login failed. Please try again.' };
			}
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
					if (user) {
						// Check if user is confirmed
						if (!user.email_confirmed_at) {
							// Sign them out immediately
							await supabase.auth.signOut();
							return { 
								ok: false, 
								error: "Please confirm your email before logging in. Check your inbox for the confirmation link.",
								requiresConfirmation: true
							};
						}
						
						// If admin login was requested, verify the user is actually admin
						if (isAdmin) {
							const profile = await fetchUserProfile(user.id);
							if (!profile?.is_admin) {
								// Sign them out immediately
								await supabase.auth.signOut();
								return { 
									ok: false, 
									error: "These credentials are not for an admin account. Please uncheck the admin login option."
								};
							}
						}
						
						return { ok: true };
					}
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
							// If admin login was requested, verify the user is actually admin
							if (isAdmin) {
								const profile = await fetchUserProfile(primaryLoginData.user.id);
								if (!profile?.is_admin) {
									// Sign them out immediately
									await supabase.auth.signOut();
									return { 
										ok: false, 
										error: "These credentials are not for an admin account. Please uncheck the admin login option."
									};
								}
							}
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
		} catch {
			return { ok: false, error: "Login failed. Please check your credentials." };
		}
	};

	const register = async ({ name, email, password, profilePicture, profilePictureFile }) => {
		if (!name || !email || !password) {
			return { ok: false, error: "All fields are required" };
		}
		
		try {
			// Handle profile picture upload if it's a file
			let finalProfilePicture = profilePicture;
			
			if (profilePictureFile) {
				// Convert file to data URL for instant storage
				const reader = new FileReader();
				finalProfilePicture = await new Promise((resolve, reject) => {
					reader.onload = () => resolve(reader.result);
					reader.onerror = reject;
					reader.readAsDataURL(profilePictureFile);
				});
			}
			
			// Sign up the user with email confirmation required
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
			
			const user = data?.user || null;
			
			// Create or update profile with name and profile picture (for when they confirm later)
			if (user) {
				const { error: profileError } = await supabase
					.from("profiles")
					.upsert({ 
						id: user.id, 
						full_name: name,
						profile_picture: finalProfilePicture,
						is_admin: false  // Explicitly set new users as non-admin
					});
				
				if (profileError) {
					console.error("Error saving profile:", profileError);
				}
			}
			
			// Check if email confirmation is required
			if (user && !data?.session) {
				// User created but not confirmed - do NOT log them in
				return { 
					ok: true, 
					requiresConfirmation: true,
					message: "Please check your email and click the confirmation link to complete your registration. You can then log in with your credentials."
				};
			}
			
			// If user is already confirmed (in development mode or if confirmations are disabled)
			if (user && data?.session) {
				const profile = await fetchUserProfile(user.id);
				const isUserAdmin = profile?.is_admin === true;
				setAuthState({
					isAuthenticated: true,
					role: isUserAdmin ? "admin" : "user",
					currentUser: {
						id: user.id,
						name: profile?.full_name || name,
						email: user.email || email,
						profilePicture: profile?.profile_picture || finalProfilePicture,
						coins: profile?.coins || 0,
						role: isUserAdmin ? "admin" : "user",
					},
					isLoading: false,
				});
				return { ok: true };
			}
			
			return { ok: false, error: "Registration failed. Please try again." };
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

	const updateProfilePicture = async (profilePicture, profilePictureFile) => {
		const userId = authState.currentUser?.id;
		if (!userId) return { ok: false, error: "No authenticated user" };

		try {
			// Handle profile picture upload if it's a file
			let finalProfilePicture = profilePicture;
			if (profilePictureFile) {
				// Convert file to data URL for instant storage
				const reader = new FileReader();
				finalProfilePicture = await new Promise((resolve, reject) => {
					reader.onload = () => resolve(reader.result);
					reader.onerror = reject;
					reader.readAsDataURL(profilePictureFile);
				});
			}

			const { error } = await supabase
				.from("profiles")
				.update({ profile_picture: finalProfilePicture })
				.eq("id", userId);

			if (error) return { ok: false, error: error.message };

			setAuthState((prev) => ({
				...prev,
				currentUser: prev.currentUser ? { 
					...prev.currentUser, 
					profilePicture: finalProfilePicture 
				} : prev.currentUser,
			}));

			return { ok: true };
		} catch {
			return { ok: false, error: "Failed to update profile picture" };
		}
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

	const addCoins = async (coinAmount) => {
		const userId = authState.currentUser?.id;
		if (!userId) return { ok: false, error: "No authenticated user" };
		
		try {
			const { error } = await supabase.rpc('add_user_coins', {
				user_id: userId,
				coin_amount: coinAmount
			});
			
			if (error) return { ok: false, error: error.message };
			
			// Update local state
			setAuthState(prev => ({
				...prev,
				currentUser: prev.currentUser ? {
					...prev.currentUser,
					coins: (prev.currentUser.coins || 0) + coinAmount
				} : prev.currentUser
			}));
			
			return { ok: true };
		} catch {
			return { ok: false, error: "Failed to add coins" };
		}
	};

	const subtractCoins = async (coinAmount) => {
		const userId = authState.currentUser?.id;
		if (!userId) return { ok: false, error: "No authenticated user" };
		
		const currentCoins = authState.currentUser?.coins || 0;
		if (currentCoins < coinAmount) {
			return { ok: false, error: "Insufficient coins" };
		}
		
		try {
			const { data, error } = await supabase.rpc('subtract_user_coins', {
				user_id: userId,
				coin_amount: coinAmount
			});
			
			if (error) return { ok: false, error: error.message };
			if (!data) return { ok: false, error: "Insufficient coins" };
			
			// Update local state
			setAuthState(prev => ({
				...prev,
				currentUser: prev.currentUser ? {
					...prev.currentUser,
					coins: Math.max(0, (prev.currentUser.coins || 0) - coinAmount)
				} : prev.currentUser
			}));
			
			return { ok: true };
		} catch {
			return { ok: false, error: "Failed to subtract coins" };
		}
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
			updateProfilePicture,
			updateEmail,
			updatePassword,
			addCoins,
			subtractCoins,
		}),
		[authState]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	return useContext(AuthContext);
}