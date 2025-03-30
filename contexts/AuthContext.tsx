import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { auth, users } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const storage = {
  getItem: async (key: string): Promise<string | null> => {
    return Platform.OS === 'web' ? localStorage.getItem(key) : await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') localStorage.setItem(key, value);
    else await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') localStorage.removeItem(key);
    else await SecureStore.deleteItemAsync(key);
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key || loading) return; // ✅ Prevents early redirection
  
    const inAuthGroup = segments[0] === '(auth)';
    console.log("Checking redirect conditions:", { user, inAuthGroup });
  
    if (user === undefined) {
      console.warn("User is undefined, waiting for auth initialization...");
      return; // ✅ Prevents redirecting based on an undefined state
    }
  
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/register');
    } else if (user && inAuthGroup) {
      console.log("Redirecting to tabs...");
      router.push('/(tabs)');
    }
  }, [user, segments, navigationState?.key, loading, router]);
  

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await storage.getItem('token');
        console.log("Retrieved token:", token);
    
        if (!token) {
          console.warn("No token found, skipping profile fetch.");
          setLoading(false);
          return;
        }
    
        const response = await users.getProfile();
        console.log("Profile response:", response?.data);
    
        if (response?.data) {
          setUser(response.data); // ✅ Ensures `user` is always properly set
        } else {
          console.warn("Invalid profile response, logging out...");
          await storage.removeItem('token');
          setUser(null); // ✅ Avoids setting `undefined`
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        await storage.removeItem('token');
        setUser(null); // ✅ Ensures user is null when error occurs
      } finally {
        setLoading(false);
      }
    };
    

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await auth.login(email, password);
      await storage.setItem('token', response.token);
      await new Promise((resolve) => setTimeout(resolve, 100)); // ✅ Ensure token is stored
      setUser(response.user);
      router.push('/(tabs)'); 
    } catch (error: any) {
      console.error('Login error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await auth.register(name, email, password);
      await storage.setItem('token', response.token);
      await new Promise((resolve) => setTimeout(resolve, 100)); // ✅ Ensure token is stored
      setUser(response.user);
      router.push('/(tabs)');
    } catch (error: any) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      await storage.removeItem('token');
      setUser(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
