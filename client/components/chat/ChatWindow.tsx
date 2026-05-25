'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Stethoscope } from 'lucide-react';
import { Message } from '@/types';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  messages: Message[];
}

export function ChatWindow({ messages }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        {/* Empty state */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-5"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Welcome to MediBot AI
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Upload your medical PDFs and ask questions. I&apos;ll provide
              accurate answers with source citations from your documents.
            </p>
          </div>

          {/* Suggestion pills */}
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {[
              'What are the symptoms of diabetes?',
              'Explain hypertension treatment',
              'Side effects of ibuprofen',
            ].map((suggestion) => (
              <div
                key={suggestion}
                className="px-3 py-1.5 rounded-full text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 font-medium"
              >
                {suggestion}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-6 space-y-5 scroll-smooth">
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </AnimatePresence>
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}
