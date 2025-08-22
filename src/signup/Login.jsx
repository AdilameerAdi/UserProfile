import AuthCard from "./AuthCard";
import { useAuth } from "./AuthContext";

export default function Login() {
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add real validation here
    login();
  };

  return <AuthCard onSubmit={handleSubmit} />;
}
