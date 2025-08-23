import AuthCard from "./AuthCard";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, register, loginWithEmail } = useAuth();
  const navigate = useNavigate();

  const [emailOrName, setEmailOrName] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoginView) {
      const res = register({ name: regName, email: regEmail, password: regPassword });
      if (!res.ok) {
        setError(res.error || "Registration failed");
        return;
      }
      const loginRes = loginWithEmail({ email: regEmail, password: regPassword });
      if (!loginRes.ok) {
        setError(loginRes.error || "Login failed");
        return;
      }
      navigate("/");
      return;
    }

    if (isAdmin) {
      if (emailOrName === "Adil" && password === "Adil") {
        login("admin");
        navigate("/admin");
      } else {
        setError("Invalid admin credentials");
      }
      return;
    }

    const res = loginWithEmail({ email: emailOrName, password });
    if (res.ok) {
      navigate("/");
    } else {
      setError(res.error || "Invalid email or password");
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
      isLoginView={isLoginView}
      setIsLoginView={setIsLoginView}
      regName={regName}
      setRegName={setRegName}
      regEmail={regEmail}
      setRegEmail={setRegEmail}
      regPassword={regPassword}
      setRegPassword={setRegPassword}
    />
  );
}
