import apiClient from "@/lib/apiClient";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";

// Define interfaces for API responses and request bodies
interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: UserRole;
    country: string;
    sector?: string;
    company?: string;
    profileImage?: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: UserRole; // Optional, defaults to buyer on backend
  country: string;
  sector?: string;
  company?: string;
}

interface UserProfileResponse {
  success: boolean;
  data: AuthResponse["user"];
}

// Authentication service functions
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse["user"]> => {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
      if (response.data.success && response.data.token && response.data.user) {
        // Use the login function from the Zustand store
        useAuth.getState().login(response.data.user, response.data.token);
        return response.data.user;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred during login.");
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse["user"]> => {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/register", data);
      if (response.data.success && response.data.token && response.data.user) {
        // Log in the user immediately after successful registration
        useAuth.getState().login(response.data.user, response.data.token);
        return response.data.user;
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred during registration.");
    }
  },

  logout: () => {
    // Clear auth state using the Zustand store function
    useAuth.getState().logout();
    // Optionally: make an API call to invalidate the token on the backend if implemented
  },

  getCurrentUser: async (): Promise<AuthResponse["user"] | null> => {
    // Check if user is already authenticated in the store
    const { isAuthenticated, user, token } = useAuth.getState();
    if (isAuthenticated && user && token) {
        // Optionally verify token validity with a lightweight backend endpoint if needed
        // For now, assume stored state is valid if isAuthenticated is true
        return user;
    }
    
    // If not authenticated in store, try fetching from backend using stored token (if any)
    // This handles cases where the page is refreshed
    const storedToken = localStorage.getItem("gpo-auth-storage") ? JSON.parse(localStorage.getItem("gpo-auth-storage")!).state.token : null;

    if (storedToken) {
        try {
            // Set the token for the apiClient instance for this specific request
            apiClient.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
            const response = await apiClient.get<UserProfileResponse>("/auth/me");
            if (response.data.success && response.data.data) {
                // Update the auth state
                useAuth.getState().login(response.data.data, storedToken);
                return response.data.data;
            } else {
                // Token might be invalid or expired
                useAuth.getState().logout();
                delete apiClient.defaults.headers.common["Authorization"];
                return null;
            }
        } catch (error: any) {
            console.error("Error fetching current user:", error.response?.data?.message || error.message);
            useAuth.getState().logout(); // Logout on error
            delete apiClient.defaults.headers.common["Authorization"];
            return null;
        }
    } else {
        // No token, user is not logged in
        return null;
    }
  },
};

