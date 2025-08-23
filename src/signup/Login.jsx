import AuthCard from "./AuthCard";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loginCredentials, register } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = loginCredentials({ emailOrName, password, isAdmin });
    if (res.ok) {
      navigate(isAdmin ? "/admin" : "/");
    } else {
      setError(res.error || "Login failed");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setSignupError("");
    if (signupPassword !== confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }
    const res = register({ name, email: signupEmail, password: signupPassword });
    if (res.ok) {
      navigate("/");
    } else {
      setSignupError(res.error || "Registration failed");
    }
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
    />
  );
}
