import AuthCard from "./AuthCard";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_AVATARS } from "../constants/profilePhotos";

export default function Login() {
  const { loginCredentials, register, isAuthenticated, isAdmin: isAdminRole } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdminRole ? "/admin" : "/");
    }
  }, [isAuthenticated, isAdminRole, navigate]);

  // login state
  const [emailOrName, setEmailOrName] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

  // signup state
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(DEFAULT_AVATARS[0]);
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await loginCredentials({ emailOrName, password, isAdmin });
    if (!res.ok) {
      setError(res.error || "Login failed");
    }
    // Navigation will be handled by useEffect when auth state updates
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");
    setSuccessMessage("");
    if (signupPassword !== confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }
    
    const res = await register({ 
      name, 
      email: signupEmail, 
      password: signupPassword, 
      profilePicture: selectedProfilePicture,
      profilePictureFile: profilePictureFile 
    });
    
    if (!res.ok) {
      setSignupError(res.error || "Registration failed");
    } else if (res.requiresConfirmation) {
      // Show success message and clear form
      setSuccessMessage(res.message);
      setName("");
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");
      setSelectedProfilePicture(DEFAULT_AVATARS[0]);
      setProfilePictureFile(null);
    }
    // Navigation will be handled by useEffect when auth state updates (if no confirmation required)
  };

  const handleProfilePictureSelect = (pictureUrl) => {
    setSelectedProfilePicture(pictureUrl);
    setProfilePictureFile(null); // Clear file if URL is selected
  };

  const handleCustomProfilePictureUpload = (file, dataUrl) => {
    setSelectedProfilePicture(dataUrl);
    setProfilePictureFile(file);
  };

  return (
    <AuthCard
      onSubmit={handleSubmit}
      onSignup={handleSignup}
      email={emailOrName}
      password={password}
      setEmail={setEmailOrName}
      setPassword={setPassword}
      error={error}
      isAdmin={isAdmin}
      setIsAdmin={setIsAdmin}
      signupName={name}
      setSignupName={setName}
      signupEmail={signupEmail}
      setSignupEmail={setSignupEmail}
      signupPassword={signupPassword}
      setSignupPassword={setSignupPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      signupError={signupError}
      successMessage={successMessage}
      selectedProfilePicture={selectedProfilePicture}
      onProfilePictureSelect={handleProfilePictureSelect}
      onCustomProfilePictureUpload={handleCustomProfilePictureUpload}
    />
  );
}
