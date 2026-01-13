import { StoredUser, UserProfile } from "../types";

const USERS_KEY = 'sekretar_users_db_v1';

// Default initial users
const DEFAULT_USERS: StoredUser[] = [
  {
    id: 'admin-1',
    username: 'admin',
    password: 'admin',
    name: 'Системный Администратор',
    email: 'admin@gov.ru',
    role: 'ADMIN',
    position: 'Руководитель департамента ИТ'
  },
  {
    id: 'user-1',
    username: 'test',
    password: 'test',
    name: 'Орлов Дмитрий Сергеевич',
    email: 'd.orlov@gov.ru',
    role: 'USER',
    position: 'Ведущий специалист'
  }
];

// Initialize DB if empty
const initUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_USERS;
  }
};

export const getAllUsers = (): StoredUser[] => {
  return initUsers();
};

export const addUser = (user: Omit<StoredUser, 'id'>): StoredUser => {
  const users = getAllUsers();
  
  // Check for duplicate username
  if (users.some(u => u.username === user.username)) {
    throw new Error('Пользователь с таким логином уже существует');
  }

  const newUser: StoredUser = {
    ...user,
    id: crypto.randomUUID()
  };

  const updatedUsers = [...users, newUser];
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  return newUser;
};

export const deleteUser = (id: string): void => {
  const users = getAllUsers();
  // Prevent deleting the last admin
  const userToDelete = users.find(u => u.id === id);
  if (userToDelete?.role === 'ADMIN' && users.filter(u => u.role === 'ADMIN').length <= 1) {
    throw new Error('Нельзя удалить последнего администратора');
  }

  const updatedUsers = users.filter(u => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
};

export const authenticateUser = (username: string, password: string, roleRequired?: 'ADMIN' | 'USER'): UserProfile | null => {
  const users = getAllUsers();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) return null;
  
  if (roleRequired && user.role !== roleRequired) return null;

  // Return UserProfile (without password)
  const { password: _, ...profile } = user;
  return profile;
};
