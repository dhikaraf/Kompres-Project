import { createContext, useContext, useEffect, useState } from 'react';

import { getCurrentUser, loginUser, registerUser } from '../services/api';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);

  /*
   * Mengambil user dari backend berdasarkan JWT
   * yang tersimpan di localStorage.
   */
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('smartgym_token');

      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();

        /*
         * Menyesuaikan beberapa kemungkinan
         * bentuk response dari backend.
         */
        const currentUser =
          response?.user || response?.data?.user || response?.data || response;

        setUser(currentUser);
      } catch (error) {
        console.error('Session tidak valid atau sudah berakhir:', error);

        localStorage.removeItem('smartgym_token');
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    initializeUser();
  }, []);

  /*
   * Login melalui backend
   */
  const login = async ({ email, password }) => {
    try {
      const response = await loginUser({
        email,
        password,
      });

      const token = response?.token || response?.data?.token;

      if (!token) {
        return {
          success: false,
          message: 'Token login tidak ditemukan.',
        };
      }

      localStorage.setItem('smartgym_token', token);

      const loggedInUser = response?.user || response?.data?.user || null;

      setUser(loggedInUser);

      return {
        success: true,
        user: loggedInUser,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Email atau kata sandi tidak sesuai.',
      };
    }
  };

  /*
   * Register melalui backend
   */
  const register = async ({ name, email, password }) => {
    try {
      const response = await registerUser({
        name,
        email,
        password,
      });

      return {
        success: true,
        user: response?.user || response?.data?.user || null,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Registrasi gagal. Silakan coba lagi.',
      };
    }
  };

  /*
   * Update user sementara di state frontend.
   *
   * Nanti ketika onboarding dihubungkan ke backend,
   * fungsi ini akan kita lengkapi agar menggunakan
   * PUT /api/profile.
   */
  const updateUser = (updatedData) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      return {
        ...currentUser,
        ...updatedData,
      };
    });
  };

  /*
   * Logout
   */
  const logout = () => {
    localStorage.removeItem('smartgym_token');
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        authLoading,
        login,
        register,
        updateUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser harus digunakan di dalam UserProvider.');
  }

  return context;
}
