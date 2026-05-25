'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Stethoscope, ShieldAlert, BookMarked, AlertCircle } from 'lucide-react';
import { SourceCard } from './SourceCard';

interface AIResponseCardProps {
  title?: string;
  content: string;
  disclaimer?: string;
  sources?: string[];
  isError?: boolean;
}

export function AIResponseCard({
  title,
  content,
  disclaimer,
  sources = [],
  isError = false,
}: AIResponseCardProps) {
  // Filter out "No source found" placeholder
  const validSources = sources.filter(
    (s) => s && s.toLowerCase() !== 'no source found'
  );

  if (isError) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
            Error
          </p>
          <p className="text-sm text-red-600 dark:text-red-300">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md shadow-blue-500/20">
          <Stethoscope className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {title ?? 'Medical Assistant Response'}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Powered by MediBot AI
          </p>
        </div>
      </div>

      {/* Answer content — rendered as Markdown */}
      <div className="prose prose-sm prose-slate dark:prose-invert max-w-none leading-relaxed text-slate-700 dark:text-slate-300">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>

      {/* Sources */}
      {validSources.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            <BookMarked className="w-3.5 h-3.5" />
            References ({validSources.length})
          </div>
          <div className="space-y-2">
            {validSources.map((source, idx) => (
              <SourceCard key={`${source}-${idx}`} source={source} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      {disclaimer && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            {disclaimer}
          </p>
        </div>
      )}
    </motion.div>
  );
}
