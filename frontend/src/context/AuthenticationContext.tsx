import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type AuthenticationContextType = {
  session: string | null;
  handleLogin: (username: string, password: string) => Promise<void>;
};

type AuthenticationContextProviderProps = {
  children: React.ReactNode;
};

type LoginResponse = {
  session?: string;
  message?: string;
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

  const value = {
    session,
    handleLogin,
  };
  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
}
