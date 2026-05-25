'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Message } from '@/types';
import { formatTime } from '@/lib/utils';
import { AIResponseCard } from './AIResponseCard';
import { TypingIndicator } from './TypingIndicator';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-end justify-end gap-2 px-4"
      >
        <div className="max-w-[75%] sm:max-w-[65%]">
          <div className="px-4 py-3 rounded-2xl rounded-br-md bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 text-right pr-1">
            {formatTime(message.timestamp)}
          </p>
        </div>
        {/* User avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 dark:from-slate-600 dark:to-slate-500 flex items-center justify-center shadow-md mb-5">
          <User className="w-4 h-4 text-white" />
        </div>
      </motion.div>
    );
  }

  // AI message
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-2 px-4"
    >
      {/* MediBot avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md shadow-blue-500/25 mt-1">
        <span className="text-white text-xs font-bold">M</span>
      </div>

      <div className="flex-1 max-w-[85%] sm:max-w-[80%]">
        {message.isLoading ? (
          <div className="px-3 py-2 rounded-2xl rounded-bl-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <TypingIndicator />
          </div>
        ) : (
          <div className="px-4 py-4 rounded-2xl rounded-bl-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <AIResponseCard
              title={message.answerTitle}
              content={message.content}
              disclaimer={message.disclaimer}
              sources={message.sources}
              isError={message.isError}
            />
          </div>
        )}
        {!message.isLoading && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 pl-1">
            {formatTime(message.timestamp)}
          </p>
        )}
      </div>
    </motion.div>
  );
}
