import AuthCard from "./AuthCard";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    if (username === "adil" && password === "ameer") {
      login();
      navigate("/", { replace: true });
    } else {
      // Optional: show an error or keep user on page
      // For now, do nothing on invalid credentials
    }
  };

  return <AuthCard onSubmit={handleSubmit} />;
}
