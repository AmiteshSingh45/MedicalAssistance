'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { SendHorizonal, Mic } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSend(value);
    setValue('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="max-w-4xl mx-auto">
        <div
          className={`flex items-end gap-2 p-2 rounded-2xl bg-white dark:bg-slate-800 border transition-all duration-200 shadow-lg ${
            isLoading
              ? 'border-blue-200 dark:border-blue-800'
              : 'border-slate-200 dark:border-slate-700 focus-within:border-blue-400 dark:focus-within:border-blue-500 focus-within:shadow-blue-500/10'
          }`}
        >
          <textarea
            ref={textareaRef}
            id="chat-input"
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={
              isLoading
                ? 'MediBot is thinking…'
                : 'Ask a medical question… (Enter to send, Shift+Enter for new line)'
            }
            className="flex-1 resize-none bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none px-2 py-2 max-h-40 overflow-y-auto disabled:opacity-60"
          />

          {/* Send button */}
          <motion.button
            id="send-button"
            whileTap={{ scale: 0.92 }}
            onClick={handleSend}
            disabled={!value.trim() || isLoading}
            className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
              value.trim() && !isLoading
                ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/30 hover:from-blue-700 hover:to-blue-600'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            <SendHorizonal className="w-4 h-4" />
          </motion.button>
        </div>

        <p className="text-center text-[11px] text-slate-400 dark:text-slate-600 mt-2">
          MediBot may be inaccurate. Always consult a healthcare professional.
        </p>
      </div>
    </div>
  );
}
