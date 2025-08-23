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
    const isAdmin = formData.get("isAdmin") === "on";

    if (isAdmin && username === "Adil" && password === "Adil") {
      login({ username, isAdmin: true });
      navigate("/admin", { replace: true });
      return;
    }

    if (username === "adil" && password === "ameer") {
      login({ username, isAdmin: false });
      navigate("/", { replace: true });
      return;
    }
    // Invalid credentials: no action for now
  };

  return <AuthCard onSubmit={handleSubmit} />;
}
