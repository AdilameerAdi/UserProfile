import AuthCard from "./AuthCard";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [emailOrName, setEmailOrName] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isAdmin) {
      if (emailOrName === "Adil" && password === "Adil") {
        login("admin");
        navigate("/admin");
      } else {
        setError("Invalid admin credentials");
      }
      return;
    }

    if (emailOrName === "adilameeradi@gmail.com" && password === "Adil") {
      login("user");
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <AuthCard
      onSubmit={handleSubmit}
      email={emailOrName}
      password={password}
      setEmail={setEmailOrName}
      setPassword={setPassword}
      error={error}
      isAdmin={isAdmin}
      setIsAdmin={setIsAdmin}
    />
  );
}
