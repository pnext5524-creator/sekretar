import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Workspace } from './components/Workspace';
import { Dashboard } from './components/Dashboard';
import { UserProfile } from './types';

type ViewState = 'landing' | 'workspace' | 'dashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  
  // Initialize theme from local storage or system preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentView('workspace');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  if (!currentUser || currentView === 'landing') {
    return (
      <LandingPage 
        onLoginSuccess={handleLoginSuccess} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    );
  }

  if (currentView === 'dashboard') {
    return (
      <Dashboard
        user={currentUser}
        onLogout={handleLogout}
        onNavigateToWorkspace={() => setCurrentView('workspace')}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    );
  }

  // Default to workspace
  return (
    <Workspace 
      user={currentUser}
      onLogout={handleLogout} 
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
      onNavigateToDashboard={() => setCurrentView('dashboard')}
    />
  );
};

export default App;