import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type AuthenticationContextType = {
  session: string | null;
  handleLogin: (username: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleRegister: (username: string, password: string) => Promise<void>;
};

type AuthenticationContextProviderProps = {
  children: React.ReactNode;
};

type LoginResponse = {
  session?: string;
  message?: string;
};

type LogoutResponse = {
  message: string;
};

const AuthenticationContext = createContext<AuthenticationContextType>(
  {} as AuthenticationContextType
);

export function useAuthentication() {
  return useContext(AuthenticationContext);
}

export function AuthenticationContextProvider({
  children,
}: AuthenticationContextProviderProps) {
  const [session, setSession] = useLocalStorage<string | null>("session");

  const handleLogin = async (
    username: string,
    password: string
  ): Promise<void> => {
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resMsg = (await res.json()) as LoginResponse;
      if (!res.ok) {
        throw new Error(resMsg.message);
      }
      setSession(resMsg.session!);
    } catch (err) {
      console.log("Error occured in login");
      throw err;
    }
  };

  const handleRegister = async (username: string, password: string) => {
    try {
      if (!username || !password) {
        throw new Error("Username and password required");
      }
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resMsg = (await res.json()) as { message: string };
      if (!res.ok) {
        throw new Error(resMsg.message);
      }
    } catch (err) {
      console.log("Error occured in register");
      console.log(err);
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/logout", {
        method: "delete",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Logout failed");
      }
      const msg = (await res.json()) as LogoutResponse;
      if (!res.ok) {
        throw new Error(msg.message);
      }
      setSession(null);
    } catch (err) {
      console.log("Error occured in logout");
      throw err;
    }
  };

  const value = {
    session,
    handleLogin,
    handleLogout,
    handleRegister,
  };

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
}
