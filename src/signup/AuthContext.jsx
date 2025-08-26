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
		
		// Handle tab visibility changes to prevent state loss
		const handleVisibilityChange = async () => {
			if (!document.hidden) {
				// Tab became visible again, just dispatch a resize event to help with rendering
				setTimeout(() => {
					try {
						window.dispatchEvent(new Event('resize'));
					} catch (error) {
						console.error('Error dispatching resize on visibility change:', error);
					}
				}, 100);
			}
		};
		
		document.addEventListener('visibilitychange', handleVisibilityChange);

		const loadSession = async () => {
			try {
				// Always start with unauthenticated state to prevent hanging
				if (isMounted) {
					setAuthState({ isAuthenticated: false, currentUser: null, role: "user", isLoading: false });
				}
			} catch (error) {
				console.error('Error setting initial state:', error);
				if (isMounted) {
					setAuthState({ isAuthenticated: false, currentUser: null, role: "user", isLoading: false });
				}
			}
		};

		// Load existing session on app start
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
			
			// Set authenticated state immediately with basic user info
			setAuthState({
				isAuthenticated: true,
				role: "user", // Default to user, will update if admin profile found
				currentUser: {
					id: nextUser.id,
					name: nextUser.user_metadata?.name || nextUser.email?.split("@")[0] || "User",
					email: nextUser.email || "",
					profilePicture: null,
					coins: 0,
					role: "user",
					hasRecoveryEmail: false,
					recoveryEmail: null,
				},
				isLoading: false,
			});
			
			// Fetch profile data in background to update user info
			try {
				// Clear cache and fetch fresh profile data
				profileCache.delete(nextUser.id);
				const profile = await fetchUserProfile(nextUser.id);
				
				if (profile) {
					// Update auth state with profile data
					const isUserAdmin = profile?.is_admin === true;
					const hasRecoveryEmail = !!(profile.recovery_email && profile.recovery_email.trim());
					
					// If user already has recovery email in database, mark it as completed permanently
					if (hasRecoveryEmail) {
						const completedKey = `recovery_email_completed_${nextUser.id}`;
						localStorage.setItem(completedKey, 'true');
					}
					
					setAuthState(prev => ({
						...prev,
						role: isUserAdmin ? "admin" : "user",
						currentUser: {
							...prev.currentUser,
							name: profile.full_name || prev.currentUser.name,
							profilePicture: profile.profile_picture,
							coins: profile.coins || 0,
							role: isUserAdmin ? "admin" : "user",
							hasRecoveryEmail: hasRecoveryEmail,
							recoveryEmail: profile.recovery_email || null,
						}
					}));
				}
			} catch (profileError) {
				console.error('❌ Error fetching profile (non-blocking):', profileError);
				// User stays authenticated with basic info
			}
		});

		return () => {
			isMounted = false;
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			authListener.subscription.unsubscribe();
		};
	}, []);


	const fetchUserProfile = async (userId) => {
		// Check cache first
		if (profileCache.has(userId)) {
			return profileCache.get(userId);
		}

		try {
			// Add timeout to prevent hanging
			const profilePromise = supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();
			
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
			);
			
			const { data, error } = await Promise.race([profilePromise, timeoutPromise]);
			
			if (error) {
				console.error("Database error fetching profile:", error);
				return null;
			}
			
			// Cache the result
			profileCache.set(userId, data);
			return data;
		} catch (fetchError) {
			console.error("Exception in fetchUserProfile:", fetchError);
			return null;
		}
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

		// Regular user login
		try {
			// Validate email format
			const isValidEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrName);
			if (!isValidEmailFormat) {
				return { ok: false, error: "Please enter a valid email address" };
			}

			// Try primary email login
			const { data, error } = await supabase.auth.signInWithPassword({ 
				email: emailOrName, 
				password: password 
			});

			if (error) {
				// If primary email fails, try recovery email
				try {
					const { data: rpcResult } = await supabase.rpc('login_with_recovery_email', {
						recovery_email: emailOrName,
						password_input: password
					});

					if (rpcResult?.success && rpcResult?.primary_email) {
						// Login with the primary email from recovery
						const { data: primaryLoginData } = await supabase.auth.signInWithPassword({ 
							email: rpcResult.primary_email, 
							password: password 
						});
						
						if (primaryLoginData?.user && !primaryLoginData.error) {
							return { ok: true };
						}
					}
				} catch (recoveryError) {
					console.error('Recovery email login failed:', recoveryError);
				}
				
				return { ok: false, error: "Invalid email or password" };
			}

			const user = data?.user;
			if (!user) {
				return { ok: false, error: "Invalid email or password" };
			}

			// Check if user is confirmed
			if (!user.email_confirmed_at) {
				await supabase.auth.signOut();
				return { 
					ok: false, 
					error: "Please confirm your email before logging in. Check your inbox for the confirmation link.",
					requiresConfirmation: true
				};
			}

			return { ok: true };
		} catch (error) {
			console.error('Login error:', error);
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
						hasRecoveryEmail: !!(profile?.recovery_email && profile.recovery_email.trim()),
						recoveryEmail: profile?.recovery_email || null,
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

	const updateRecoveryEmail = async (newRecoveryEmail) => {
		const userId = authState.currentUser?.id;
		if (!userId) return { ok: false, error: "No authenticated user" };
		
		try {
			const { error } = await supabase
				.from("profiles")
				.update({ recovery_email: newRecoveryEmail })
				.eq("id", userId);

			if (error) return { ok: false, error: error.message };

			// Update local state
			const hasRecoveryEmail = !!(newRecoveryEmail && newRecoveryEmail.trim());
			setAuthState((prev) => ({
				...prev,
				currentUser: prev.currentUser ? {
					...prev.currentUser,
					hasRecoveryEmail: hasRecoveryEmail,
					recoveryEmail: newRecoveryEmail,
				} : prev.currentUser,
			}));

			// Mark recovery email setup as permanently completed if email was added
			if (hasRecoveryEmail) {
				const completedKey = `recovery_email_completed_${userId}`;
				localStorage.setItem(completedKey, 'true');
			}

			return { ok: true };
		} catch {
			return { ok: false, error: "Failed to update recovery email" };
		}
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
		// Clear all storage and cache on explicit logout
		localStorage.clear();
		sessionStorage.clear();
		profileCache.clear();
		
		// Update auth state immediately (don't wait for Supabase)
		setAuthState({ isAuthenticated: false, role: "user", currentUser: null, isLoading: false });
		
		// Sign out from Supabase
		try {
			// Add timeout to prevent hanging
			const signOutPromise = supabase.auth.signOut();
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error('Signout timeout')), 3000)
			);
			
			await Promise.race([signOutPromise, timeoutPromise]);
		} catch (error) {
			console.warn('Logout from Supabase failed, but local state cleared:', error);
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
			updateRecoveryEmail,
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