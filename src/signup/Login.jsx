import AuthCard from "./AuthCard";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // State for login inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate credentials
    if (email === "adilameeradi@gmail.com" && password === "Adil") {
      login(); // Call auth context login
      navigate("/"); // Redirect to Home page
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <AuthCard
      onSubmit={handleSubmit}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      error={error}
    />
  );
}
