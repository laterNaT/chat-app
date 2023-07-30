import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "../context/AuthenticationContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { session } = useAuthentication();
  const { handleRegister } = useAuthentication();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await handleRegister(username, password);
      navigate("/login");
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    if (session) {
      navigate("/home");
    }
  }, [session, navigate]);

  return (
    <div className="container">
      <div className="login-form">
        <h1>Welcome, register an account by submitting the form below.</h1>
        <form method="post" onSubmit={handleSubmit}>
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
            Register
          </button>
          {error && <p className="error-message">{error} 🚨️</p>}
        </form>
        <p style={{ textAlign: "center" }}>
          Already have an account? Click <Link to="/login">here</Link>
        </p>
      </div>
    </div>
  );
}
