import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../context/AuthenticationContext";
import "../styles/Login.scss";

export default function Login() {
  const { session } = useAuthentication();
  const { handleLogin } = useAuthentication();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    await handleLogin(username, password);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login().catch((err: Error) => setError(err.message));
  };

  useEffect(() => {
    if (session) {
      navigate("/home");
    }
  }, [session, navigate]);

  return (
    <div className="container">
      <div className="login-form">
        <h1>Welcome back! Please sign in to continue.</h1>
        <form method="POST" onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" className="button">
            Login
          </button>
          {error && <p className="error-message">{error} 🚨️</p>}
        </form>
      </div>
    </div>
  );
}
