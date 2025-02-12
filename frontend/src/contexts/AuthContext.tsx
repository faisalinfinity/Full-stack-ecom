import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../hooks/use-toast";
import { BASE_URL } from "../config/baseurl";
import Cookies from "node_modules/@types/js-cookie";

interface User {
  fullName: string;
  token: string;
}
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(BASE_URL + "/api/auth/login", {
        email,
        password,
      });
      Cookies.set("user", JSON.stringify(response.data), { expires: 1 });

      setIsAuthenticated(true);
      setUser(response.data);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    try {
      await axios.post(BASE_URL + "/api/auth/register", {
        fullName,
        email,
        password,
      });
      toast({
        title: "Registration Successful",
        description: "You can now log in with your new account.",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  useEffect(() => {
    const user: User = JSON.parse(Cookies.get("user") || "{}");
    if (user.token) {
      setIsAuthenticated(true);
      setUser(user);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
