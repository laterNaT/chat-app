import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../context/AuthenticationContext";

export default function Login() {
  const { handleLogin } = useAuthentication();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      handleLogin(username, password);
      navigate("/home");
    } catch (err) {
      console.log("error in handleSubmit");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
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
        <button type="submit" style={{ width: "100px" }}>
          Login
        </button>
      </form>
    </div>
  );
}
