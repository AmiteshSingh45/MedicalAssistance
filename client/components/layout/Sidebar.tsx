'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  FileUp,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { PDFUpload } from '@/components/upload/PDFUpload';

interface SidebarProps {
  uploadedCount: number;
  onUploadSuccess: (count: number) => void;
}

export function Sidebar({ uploadedCount, onUploadSuccess }: SidebarProps) {
  const [uploadExpanded, setUploadExpanded] = useState(true);

  return (
    <aside className="w-full md:w-72 lg:w-80 flex-shrink-0 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
      {/* Branding */}
      <div className="px-5 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              MediBot AI
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Medical RAG Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
            <div className="flex items-center gap-1.5 mb-1">
              <FileUp className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Uploaded
              </span>
            </div>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {uploadedCount}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              PDFs indexed
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <div className="flex items-center gap-1.5 mb-1">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                Model
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Llama 3.3
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              70B Versatile
            </p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="flex-1 px-5 py-4 space-y-4">
        {/* Collapsible header */}
        <button
          id="toggle-upload-section"
          onClick={() => setUploadExpanded((v) => !v)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <FileUp className="w-3.5 h-3.5" />
            Upload Documents
          </span>
          {uploadExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        <motion.div
          initial={false}
          animate={{ height: uploadExpanded ? 'auto' : 0, opacity: uploadExpanded ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <PDFUpload onUploadSuccess={onUploadSuccess} />
        </motion.div>
      </div>

      {/* Footer info */}
      <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Powered by Groq + Pinecone + HuggingFace. Upload PDFs first, then ask questions.
          </p>
        </div>
      </div>
    </aside>
  );
}
