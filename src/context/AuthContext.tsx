import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthState = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          setUser({
            id: "1",
            email: "admin@example.com",
            role: "admin",
            name: "Admin User",
            avatar:
              "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
          });
        } catch (err) {
          localStorage.removeItem("token");
          console.error("Failed to verify authentication token:", err);
        }
      }

      setLoading(false);
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Mock successful login
      const token = "mock-jwt-token";
      localStorage.setItem("token", token);

      // Set user with admin role for the demo
      if (email === "admin@example.com") {
        setUser({
          id: "1",
          email,
          role: "admin",
          name: "Admin User",
          avatar:
            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
        });
      } else {
        setUser({
          id: "2",
          email,
          role: "user",
          name: "Regular User",
          avatar:
            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
        });
      }
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
