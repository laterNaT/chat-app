import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

import createClient from "openapi-fetch";
import { paths } from "../types/v1";

const { POST, DELETE } = createClient<paths>({
  baseUrl: "http://localhost:5000",
});

type AuthenticationContextType = {
  session: string | null;
  username: string | null;
  handleLogin: (username: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleRegister: (username: string, password: string) => Promise<void>;
};

type AuthenticationContextProviderProps = {
  children: React.ReactNode;
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
  const [username, setUsername] = useLocalStorage<string | null>("username");

  const handleLogin = async (username: string, password: string) => {
    try {
      if (!username || !password) {
        throw new Error("Username and password required");
      }

      const { data, error } = await POST("/api/users/login", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: {
          username,
          password,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      setSession(data.session);
      setUsername(username);
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
      const { error } = await POST("/api/users/register", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: {
          username,
          password,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      console.log("Error occured in register");
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await DELETE("/api/users/logout", {
        credentials: "include",
      });
      if (error) {
        throw new Error(error.message);
      }
      setSession(null);
    } catch (err) {
      console.log("Error occured in logout");
      throw err;
    }
  };

  const value = {
    session,
    username,
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
