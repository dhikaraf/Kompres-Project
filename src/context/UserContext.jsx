import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext(null);

/*
 * Data user dummy untuk testing frontend.
 * Hanya digunakan selama pengembangan.
 */
const defaultUsers = [
  {
    id: 1,
    username: 'demo',
    email: 'demo@smartgym.local',
    password: 'Demo12345',
    goal: '',
    age: null,
    gender: '',
    weight: null,
    height: null,
  },
];

export function UserProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('smartgym_users');

    if (savedUsers) {
      return JSON.parse(savedUsers);
    }

    return defaultUsers;
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('smartgym_current_user');

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return null;
  });

  useEffect(() => {
    localStorage.setItem('smartgym_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smartgym_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smartgym_current_user');
    }
  }, [user]);

  const register = ({ username, email, password }) => {
    const existingUser = users.find(
      (item) =>
        item.username.toLowerCase() === username.toLowerCase() ||
        item.email.toLowerCase() === email.toLowerCase(),
    );

    if (existingUser) {
      return {
        success: false,
        message: 'Nama pengguna atau email sudah digunakan.',
      };
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      goal: '',
      age: null,
      gender: '',
      weight: null,
      height: null,
    };

    setUsers((currentUsers) => [...currentUsers, newUser]);

    setUser(newUser);

    return {
      success: true,
      user: newUser,
    };
  };

  const login = ({ username, password }) => {
    const foundUser = users.find(
      (item) =>
        item.username.toLowerCase() === username.toLowerCase() &&
        item.password === password,
    );

    if (!foundUser) {
      return {
        success: false,
        message: 'Nama pengguna atau kata sandi tidak sesuai.',
      };
    }

    setUser(foundUser);

    return {
      success: true,
      user: foundUser,
    };
  };

  const updateUser = (updatedData) => {
    if (!user) {
      return;
    }

    const updatedUser = {
      ...user,
      ...updatedData,
    };

    setUser(updatedUser);

    setUsers((currentUsers) =>
      currentUsers.map((item) =>
        item.id === updatedUser.id ? updatedUser : item,
      ),
    );
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        users,
        register,
        login,
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
