'use client';

import { Moon, Sun, Trash2, Stethoscope } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  onClearChat: () => void;
  messageCount: number;
}

export function Header({ onClearChat, messageCount }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  return (
    <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-10">
      {/* Left: Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center md:hidden">
          <Stethoscope className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Medical Assistant Chat
          </h2>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Ask questions about your uploaded medical documents
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {messageCount > 0 && (
          <button
            id="clear-chat-button"
            onClick={onClearChat}
            title="Clear chat"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all duration-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}

        <button
          id="theme-toggle"
          onClick={toggleTheme}
          title="Toggle dark mode"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
