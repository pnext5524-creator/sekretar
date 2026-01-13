import React, { useEffect, useState } from 'react';
import { ArchiveItem, UserProfile } from '../types';
import { getArchive, deleteFromArchive } from '../services/storageService';
import { AdminPanel } from './AdminPanel';
import { 
  Briefcase, 
  User, 
  LogOut, 
  Calendar, 
  FileText, 
  Search, 
  ArrowLeft,
  Trash2,
  Eye,
  Clock,
  Sun,
  Moon,
  Users,
  Archive
} from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
  onNavigateToWorkspace: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  user: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onLogout, 
  onNavigateToWorkspace,
  isDarkMode,
  toggleTheme,
  user
}) => {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  
  // Admin View State
  const [activeTab, setActiveTab] = useState<'archive' | 'users'>('archive');

  useEffect(() => {
    setItems(getArchive());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Вы уверены, что хотите удалить этот документ из архива?')) {
      deleteFromArchive(id);
      setItems(prev => prev.filter(item => item.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const filteredItems = items.filter(item => 
    item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.instruction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateToWorkspace}>
            <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
              <Briefcase size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Секретарь 2.0</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {user.role === 'ADMIN' ? 'Панель администратора' : 'Личный кабинет'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
             <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'}`}>
                <User size={14} />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[150px] truncate">{user.name}</span>
            </div>

            <button 
              onClick={onLogout}
              className="text-slate-500 hover:text-red-500 transition-colors"
              title="Выйти"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {activeTab === 'users' ? 'Сотрудники' : 'Архив обращений'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {activeTab === 'users' ? 'Управление доступом к системе' : 'История всех подготовленных ответов'}
            </p>
          </div>
          <div className="flex space-x-3">
             {user.role === 'ADMIN' && (
                <div className="bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 flex space-x-1">
                   <button 
                      onClick={() => setActiveTab('archive')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                        activeTab === 'archive' 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                   >
                     <Archive size={16} />
                     <span>Архив</span>
                   </button>
                   <button 
                      onClick={() => setActiveTab('users')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                        activeTab === 'users' 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                   >
                     <Users size={16} />
                     <span>Пользователи</span>
                   </button>
                </div>
             )}

            <button
              onClick={onNavigateToWorkspace}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">К созданию ответа</span>
            </button>
          </div>
        </div>

        {activeTab === 'users' && user.role === 'ADMIN' ? (
          <AdminPanel />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
            {/* List Column */}
            <div className="lg:col-span-1 flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                    <FileText size={48} className="mb-4 opacity-50" />
                    <p>В архиве пока нет документов</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredItems.map(item => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 group ${
                          selectedItem?.id === item.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-medium text-slate-400 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {new Date(item.timestamp).toLocaleDateString('ru-RU')}
                          </span>
                          <button 
                            onClick={(e) => handleDelete(item.id, e)}
                            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">
                          {item.fileName}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {item.instruction}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Detail Column */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
              {selectedItem ? (
                <div className="flex flex-col h-full">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedItem.fileName}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-1">
                        <Calendar size={14} className="mr-1" />
                        Создан: {formatDate(selectedItem.timestamp)}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded-full uppercase tracking-wider">
                      {selectedItem.status === 'DRAFT' ? 'Проект' : 'Отправлен'}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="mb-6">
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Резолюция (Задание)
                      </h4>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {selectedItem.instruction}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Текст ответа
                      </h4>
                      <div className="prose prose-sm dark:prose-invert max-w-none p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                        <pre className="whitespace-pre-wrap font-serif text-base leading-relaxed text-slate-900 dark:text-slate-100 font-sans">
                          {selectedItem.responseText}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Eye size={32} />
                  </div>
                  <p className="text-lg font-medium">Выберите документ для просмотра</p>
                  <p className="text-sm max-w-xs text-center mt-2">
                    Слева находится список всех сгенерированных вами ответов.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
