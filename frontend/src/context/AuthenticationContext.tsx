import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type AuthenticationContextType = {
  session: string | null;
  handleLogin: (username: string, password: string) => void;
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

  const handleLogin = async (username: string, password: string) => {
    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      console.log("error in handleLogin");
      throw new Error("Login failed");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const resMsg = await res.json();
    console.log("resMsg", resMsg);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setSession(resMsg.session);
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
