'use client';

import { FileText, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { ParsedSource } from '@/types';
import { parseSource } from '@/lib/utils';

interface SourceCardProps {
  source: string;
  index: number;
}

export function SourceCard({ source, index }: SourceCardProps) {
  const parsed: ParsedSource = parseSource(source);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors duration-200"
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
          {parsed.filename}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <BookOpen className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            Page {parsed.page}
          </span>
        </div>
      </div>

      {/* Citation number */}
      <span className="flex-shrink-0 text-xs font-bold text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 rounded-full w-5 h-5 flex items-center justify-center">
        {index + 1}
      </span>
    </motion.div>
  );
}
