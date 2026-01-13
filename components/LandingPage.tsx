import React, { useState, useRef } from 'react';
import { ShieldCheck, Zap, FileCheck, LogIn, ChevronRight, Lock, Moon, Sun, Server, EyeOff, Database, X, Mail, Send, Phone, Cpu, FileSearch, Layers, Globe, HardDrive, FileKey, UserCog } from 'lucide-react';
import { UserProfile } from '../types';
import { authenticateUser } from '../services/userService';

interface LandingPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess, isDarkMode, toggleTheme }) => {
  // User Login State (Main Card)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const usernameInputRef = useRef<HTMLInputElement>(null);
  
  // Animation State
  const [highlightLogin, setHighlightLogin] = useState(false);
  
  // Admin Login State (Modal)
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Modal states
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Handle Standard User Login
  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = authenticateUser(username, password, 'USER');
    
    if (user) {
      onLoginSuccess(user);
    } else {
      setError('Неверный логин или пароль');
    }
  };

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const admin = authenticateUser(adminUsername, adminPassword, 'ADMIN');

    if (admin) {
      onLoginSuccess(admin);
    } else {
      setAdminError('Доступ запрещен: Неверные учетные данные или недостаточно прав');
    }
  };

  const handleStartWorkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const loginSection = document.getElementById('login');
    if (loginSection) {
      loginSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Trigger highlight animation
      setHighlightLogin(true);
      
      // Focus input
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 500);

      // Remove highlight after animation
      setTimeout(() => {
        setHighlightLogin(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-300 selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <FileCheck size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Секретарь 2.0</span>
          </div>
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
              <button onClick={() => setShowFeatures(true)} className="hover:text-blue-600 dark:hover:text-white transition-colors">Возможности</button>
              <button onClick={() => setShowSecurity(true)} className="hover:text-blue-600 dark:hover:text-white transition-colors">Безопасность</button>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={() => setShowAdminLogin(true)}
              className="hidden md:flex px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all text-sm font-medium items-center gap-2"
            >
              <UserCog size={16} />
              Вход в систему
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Abstract Background Gradient */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-20 animate-blob"></div>
        <div className="absolute top-24 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Text */}
            <div className="space-y-8 relative z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span>Доступна версия 2.0</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
                Ваш личный ассистент, который <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  пишет ответы за вас
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                Первая специализированная система для органов государственной власти. Загрузите скан обращения — получите юридически выверенный ответ за 30 секунд.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleStartWorkClick}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center transform hover:scale-105 active:scale-95"
                >
                  Начать работу
                  <ChevronRight size={18} className="ml-2" />
                </button>
                <button 
                  onClick={() => setShowFeatures(true)}
                  className="px-8 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-all border border-slate-200 dark:border-slate-700 transform hover:scale-105 active:scale-95"
                >
                  Узнать больше
                </button>
              </div>
            </div>

            {/* Right Column: User Login Card */}
            <div id="login" className="relative p-2">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform skew-y-3 rounded-3xl opacity-10 dark:opacity-20 blur-xl"></div>
              <div className={`relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border p-8 rounded-3xl shadow-2xl transition-all duration-500 ${
                  highlightLogin 
                    ? 'border-blue-500 ring-4 ring-blue-500/30 scale-[1.02] shadow-blue-500/40' 
                    : 'border-slate-200 dark:border-slate-700'
                }`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Авторизация</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Вход для сотрудников отделов</p>
                </div>

                <form onSubmit={handleUserLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Логин</label>
                    <div className="relative">
                      <input
                        ref={usernameInputRef}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all outline-none"
                        placeholder="user"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Пароль</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all outline-none"
                        placeholder="•••••"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg flex items-center gap-2 border border-red-100 dark:border-transparent">
                      <Lock size={14} />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg transform transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
                  >
                    <LogIn size={18} />
                    <span>Войти</span>
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Тестовый доступ: test / test
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Features Grid Teaser */}
      <div className="bg-white dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 py-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Почему выбирают Секретарь 2.0?</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Мы объединили передовые технологии ИИ с глубоким пониманием бюрократических процессов.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 cursor-pointer" onClick={() => setShowFeatures(true)}>
            <FeatureCard 
              icon={<Zap className="text-amber-500 dark:text-amber-400" size={32} />}
              title="Мгновенная скорость"
              description="Сокращает время подготовки ответа с 30 минут до 30 секунд. ИИ читает сканы и понимает суть проблемы."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-green-500 dark:text-green-400" size={32} />}
              title="Юридическая защита"
              description="Встроенный модуль правовой экспертизы проверяет ответ на соответствие 59-ФЗ и Гражданскому кодексу."
            />
            <FeatureCard 
              icon={<FileCheck className="text-blue-500 dark:text-blue-400" size={32} />}
              title="Интеграция с СЭД"
              description="Экспорт готовых проектов ответов в форматы 1С:Документооборот, Directum RX и СЭД «Дело»."
            />
          </div>
          <div className="mt-12 text-center">
            <button 
               onClick={() => setShowFeatures(true)}
               className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center"
            >
              Посмотреть все возможности <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Security Section Teaser */}
      <div className="py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 cursor-pointer" onClick={() => setShowSecurity(true)}>
               {/* Visual Security Card */}
               <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-2xl relative hover:shadow-blue-500/10 transition-shadow">
                  <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">Протокол безопасности</h4>
                      <div className="flex items-center mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Шифрование включено</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                     {/* Mock logs */}
                     <div className="font-mono text-xs text-slate-500 dark:text-slate-400 space-y-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                       <p className="flex items-center"><span className="w-16 opacity-50">10:42:01</span> <span className="text-blue-500 mr-2">INFO</span> Initializing secure connection...</p>
                       <p className="flex items-center"><span className="w-16 opacity-50">10:42:02</span> <span className="text-blue-500 mr-2">INFO</span> Verifying SSL certificates...</p>
                       <p className="flex items-center"><span className="w-16 opacity-50">10:42:03</span> <span className="text-green-500 mr-2">SUCCESS</span> Connection established (TLS 1.3)</p>
                       <p className="flex items-center"><span className="w-16 opacity-50">10:42:03</span> <span className="text-purple-500 mr-2">SECURE</span> Data encryption: GOST R 34.10-2012</p>
                       <p className="flex items-center"><span className="w-16 opacity-50">10:42:04</span> <span className="text-amber-500 mr-2">AUTH</span> Access control: Role-Based (RBAC)</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
                Безопасность государственного уровня
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Мы понимаем критическую важность защиты данных. Архитектура системы построена с учетом требований ФСТЭК к информационным системам (ГИС).
              </p>
              
              <div className="space-y-6">
                <SecurityItem 
                  icon={<Server size={20} className="text-blue-500" />}
                  title="Защищенный контур" 
                  description="Возможность развертывания на локальных серверах организации (On-premise) в изолированной сети."
                />
                <SecurityItem 
                  icon={<Lock size={20} className="text-green-500" />}
                  title="Шифрование по ГОСТ" 
                  description="Поддержка отечественных алгоритмов шифрования ГОСТ Р 34.10-2012 для защиты каналов связи."
                />
                <SecurityItem 
                  icon={<EyeOff size={20} className="text-purple-500" />}
                  title="Приватность данных" 
                  description="Обрабатываемые документы не сохраняются на внешних серверах и не используются для дообучения моделей."
                />
                <div className="mt-6">
                  <button 
                     onClick={() => setShowSecurity(true)}
                     className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center"
                  >
                    Подробнее о стандартах защиты <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center opacity-70 dark:opacity-50">
          <p className="text-sm text-slate-600 dark:text-slate-400">© {new Date().getFullYear()} Секретарь 2.0. Все права защищены.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button 
              onClick={() => setShowPrivacy(true)}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              Политика конфиденциальности
            </button>
            <button 
              onClick={() => setShowSupport(true)}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              Техническая поддержка
            </button>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}

      {/* ADMIN LOGIN MODAL */}
      <Modal isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} title="Административный доступ">
        <div className="flex flex-col">
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-lg flex items-start gap-3">
             <ShieldCheck className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
             <div>
               <p className="text-sm font-bold text-red-800 dark:text-red-300">Внимание!</p>
               <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                 Доступ к панели управления системой разрешен только авторизованным администраторам. Все попытки входа регистрируются.
               </p>
             </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Системный логин</label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 dark:text-white transition-all outline-none font-mono"
                placeholder="root"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Ключ доступа</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 dark:text-white transition-all outline-none font-mono"
                placeholder="••••••••"
              />
            </div>

            {adminError && (
              <div className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                <Lock size={14} />
                {adminError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-semibold rounded-xl shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center space-x-2"
            >
              <span>Войти как Администратор</span>
              <ChevronRight size={16} />
            </button>
          </form>
           <div className="mt-4 text-center">
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Доступ: admin / admin
                  </p>
            </div>
        </div>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Политика конфиденциальности">
        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p className="mb-4">
            Настоящая Политика конфиденциальности определяет порядок обработки и меры по обеспечению безопасности персональных данных, предпринимаемые в рамках использования программного комплекса «Секретарь 2.0».
          </p>
          
          <h4 className="text-slate-900 dark:text-white font-bold mt-4 mb-2">1. Общие положения</h4>
          <p className="mb-4">
            1.1. Система разработана с учетом требований Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».<br/>
            1.2. Оператор ставит своей важнейшей целью и условием осуществления своей деятельности соблюдение прав и свобод человека и гражданина при обработке его персональных данных.
          </p>

          <h4 className="text-slate-900 dark:text-white font-bold mt-4 mb-2">2. Безопасность данных</h4>
          <p className="mb-4">
            2.1. Мы не храним загруженные пользователями документы на внешних серверах дольше, чем это необходимо для генерации ответа (сессия обработки).<br/>
            2.2. Загруженные файлы и сгенерированные тексты не используются для дообучения нейросетевых моделей.<br/>
            2.3. Взаимодействие с сервером происходит по защищенным каналам связи с использованием шифрования (SSL/TLS, ГОСТ).
          </p>

          <h4 className="text-slate-900 dark:text-white font-bold mt-4 mb-2">3. Ответственность</h4>
          <p className="mb-4">
            3.1. Пользователь несет ответственность за правомерность загрузки документов, содержащих сведения, составляющие государственную или иную охраняемую законом тайну.<br/>
            3.2. Администрация сервиса не несет ответственности за смысловое содержание сгенерированных ответов. Все проекты документов должны проходить обязательную проверку уполномоченным сотрудником.
          </p>
        </div>
      </Modal>

      {/* Tech Support Modal */}
      <Modal isOpen={showSupport} onClose={() => setShowSupport(false)} title="Техническая поддержка">
         <div className="flex flex-col items-center justify-center p-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-6">
               МР
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Максим Романов</h3>
            <p className="text-blue-600 dark:text-blue-400 font-medium mb-8">Ведущий разработчик</p>
            
            <div className="w-full space-y-4 max-w-sm">
               <a href="mailto:max.strike@bk.ru" className="flex items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all group">
                  <div className="bg-white dark:bg-slate-700 p-2.5 rounded-lg shadow-sm mr-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                     <Mail size={20} />
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                     <p className="text-slate-900 dark:text-white font-medium">max.strike@bk.ru</p>
                  </div>
               </a>

               <a href="https://wa.me/79114256880" target="_blank" rel="noopener noreferrer" className="flex items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-500 transition-all group">
                  <div className="bg-white dark:bg-slate-700 p-2.5 rounded-lg shadow-sm mr-4 group-hover:bg-green-500 group-hover:text-white transition-colors">
                     <Phone size={20} />
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 dark:text-slate-400">WhatsApp</p>
                     <p className="text-slate-900 dark:text-white font-medium">+7 911 425 68 80</p>
                  </div>
               </a>

               <a href="https://t.me/ax_x_ax" target="_blank" rel="noopener noreferrer" className="flex items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 transition-all group">
                  <div className="bg-white dark:bg-slate-700 p-2.5 rounded-lg shadow-sm mr-4 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                     <Send size={20} />
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Telegram</p>
                     <p className="text-slate-900 dark:text-white font-medium">@ax_x_ax</p>
                  </div>
               </a>
            </div>

            <div className="mt-8 text-center text-xs text-slate-400 max-w-xs">
               Отвечаем на запросы в течение 24 часов в рабочие дни. Для срочных вопросов используйте Telegram.
            </div>
         </div>
      </Modal>

      {/* Features Modal */}
      <Modal isOpen={showFeatures} onClose={() => setShowFeatures(false)} title="Функциональные возможности">
         <div className="space-y-6">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              «Секретарь 2.0» — это экспертная система класса G2G/G2C, автоматизирующая рутинные операции государственных служащих.
            </p>

            <div className="grid gap-4">
               <FeatureDetailRow 
                  icon={<Cpu className="text-indigo-500" />}
                  title="Нейросетевое ядро GovAI"
                  description="Специализированная LLM-модель, дообученная на регламентах делопроизводства. Умеет писать отказы, разъяснения и уведомления, строго следуя канцелярскому стилю."
               />
               <FeatureDetailRow 
                  icon={<FileSearch className="text-blue-500" />}
                  title="Умное распознавание (AI OCR)"
                  description="Извлечение смысла из рукописных заявлений бабушек и некачественных фотокопий. Система сама находит ФИО, адрес и суть проблемы."
               />
               <FeatureDetailRow 
                  icon={<ShieldCheck className="text-green-500" />}
                  title="Модуль правового контроля"
                  description="Автоматический аудит текста перед отправкой: проверка ссылок на актуальные редакции законов (Консультант+, Гарант) и контроль сроков по 59-ФЗ."
               />
               <FeatureDetailRow 
                  icon={<Layers className="text-amber-500" />}
                  title="Коннекторы к СЭД"
                  description="Прямая интеграция с «СЭД Дело», Directum RX и 1С:Документооборот. Генерация карточек РКК и проектов исходящих документов в один клик."
               />
               <FeatureDetailRow 
                  icon={<Globe className="text-purple-500" />}
                  title="Мобильное рабочее место"
                  description="Адаптивный интерфейс для работы с планшетов во время выездных проверок или совещаний. Поддержка PWA."
               />
            </div>
         </div>
      </Modal>

      {/* Security Modal */}
      <Modal isOpen={showSecurity} onClose={() => setShowSecurity(false)} title="Аттестация и безопасность">
         <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                Архитектура системы «Секретарь 2.0» разработана для соответствия требованиям ФСТЭК России к государственным информационным системам (ГИС) до 1-го класса защищенности включительно.
              </p>
            </div>

            <div className="space-y-4">
               <SecurityDetailRow 
                  title="Импортозамещение (Реестр ПО)"
                  description="Серверная часть полностью совместима с отечественными операционными системами (Astra Linux Special Edition, РЕД ОС, Альт Линукс). Поддержка СУБД Postgres Pro."
                  icon={<HardDrive size={18} className="text-blue-500" />}
               />
               <SecurityDetailRow 
                  title="Криптографическая защита (ГОСТ)"
                  description="Поддержка работы через защищенные каналы связи с использованием алгоритмов ГОСТ Р 34.10-2012 (при интеграции с КриптоПро CSP / ViPNet)."
                  icon={<FileKey size={18} className="text-green-500" />}
               />
               <SecurityDetailRow 
                  title="Защищенный контур (Private Cloud)"
                  description="Возможность установки «On-premise» в закрытом контуре организации без доступа в интернет. Локальная работа нейросетевых моделей без передачи данных вовне."
                  icon={<Server size={18} className="text-purple-500" />}
               />
               <SecurityDetailRow 
                  title="Ролевая модель и аудит"
                  description="Дискреционное и ролевое разграничение доступа (RBAC). Журналирование всех действий операторов для интеграции с SIEM-системами."
                  icon={<Database size={18} className="text-amber-500" />}
               />
            </div>
         </div>
      </Modal>

    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors group">
    <div className="mb-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
      {description}
    </p>
  </div>
);

const SecurityItem: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 mt-1 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
      {icon}
    </div>
    <div>
      <h4 className="text-base font-bold text-slate-900 dark:text-white">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const FeatureDetailRow: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
   <div className="flex gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
      <div className="flex-shrink-0 mt-1 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
         {icon}
      </div>
      <div>
         <h4 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h4>
         <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{description}</p>
      </div>
   </div>
);

const SecurityDetailRow: React.FC<{ title: string, description: string, icon: React.ReactNode }> = ({ title, description, icon }) => (
   <div className="flex gap-4 p-3 border border-slate-100 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900/50 shadow-sm">
      <div className="flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{description}</p>
      </div>
   </div>
);

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};