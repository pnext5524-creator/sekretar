import React, { useState, useEffect } from 'react';
import { StoredUser } from '../types';
import { getAllUsers, addUser, deleteUser } from '../services/userService';
import { Trash2, UserPlus, Eye, EyeOff, Shield, User, X, Check } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Form State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newRole, setNewRole] = useState<'USER' | 'ADMIN'>('USER');
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(getAllUsers());
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        deleteUser(id);
        loadUsers();
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newUsername || !newPassword || !newName) {
      setError('Заполните обязательные поля');
      return;
    }

    try {
      addUser({
        username: newUsername,
        password: newPassword,
        name: newName,
        email: newEmail || 'no-email@gov.ru',
        position: newPosition || 'Сотрудник',
        role: newRole
      });
      setShowAddModal(false);
      resetForm();
      loadUsers();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const resetForm = () => {
    setNewUsername('');
    setNewPassword('');
    setNewName('');
    setNewEmail('');
    setNewPosition('');
    setNewRole('USER');
    setError('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Управление пользователями</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Список сотрудников, имеющих доступ к системе
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <UserPlus size={18} />
          <span>Добавить пользователя</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Сотрудник</th>
              <th className="px-6 py-4 font-semibold">Логин</th>
              <th className="px-6 py-4 font-semibold">Пароль</th>
              <th className="px-6 py-4 font-semibold">Роль</th>
              <th className="px-6 py-4 font-semibold text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    }`}>
                      {user.role === 'ADMIN' ? <Shield size={18} /> : <User size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user.position}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    {user.username}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm text-slate-600 dark:text-slate-300 w-24 truncate">
                      {visiblePasswords[user.id] ? user.password : '••••••••'}
                    </span>
                    <button 
                      onClick={() => togglePasswordVisibility(user.id)}
                      className="text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      {visiblePasswords[user.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                  }`}>
                    {user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                    title="Удалить"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Новый пользователь</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Логин *</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                    placeholder="user123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Пароль *</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                    placeholder="pass123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ФИО Сотрудника *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                  placeholder="Иванов Иван Иванович"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Должность</label>
                <input
                  type="text"
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                  placeholder="Специалист 1 разряда"
                />
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Роль в системе</label>
                 <div className="flex space-x-4">
                   <label className="flex items-center space-x-2 cursor-pointer">
                     <input 
                        type="radio" 
                        name="role" 
                        checked={newRole === 'USER'} 
                        onChange={() => setNewRole('USER')}
                        className="text-blue-600 focus:ring-blue-500"
                     />
                     <span className="text-sm text-slate-700 dark:text-slate-300">Пользователь</span>
                   </label>
                   <label className="flex items-center space-x-2 cursor-pointer">
                     <input 
                        type="radio" 
                        name="role" 
                        checked={newRole === 'ADMIN'} 
                        onChange={() => setNewRole('ADMIN')}
                        className="text-purple-600 focus:ring-purple-500"
                     />
                     <span className="text-sm text-slate-700 dark:text-slate-300">Администратор</span>
                   </label>
                 </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <Check size={18} />
                <span>Создать пользователя</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
