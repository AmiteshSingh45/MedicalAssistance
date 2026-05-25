'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
} from 'lucide-react';
import { uploadPDFs } from '@/services/api';
import { UploadedFile } from '@/types';
import { formatFileSize } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface PDFUploadProps {
  onUploadSuccess?: (count: number) => void;
}

export function PDFUpload({ onUploadSuccess }: PDFUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [globalStatus, setGlobalStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: File[]) => {
    const pdfs = newFiles.filter(
      (f) => f.type === 'application/pdf' || f.name.endsWith('.pdf')
    );
    if (pdfs.length === 0) {
      setGlobalStatus('error');
      setStatusMessage('Only PDF files are supported.');
      return;
    }
    const mapped: UploadedFile[] = pdfs.map((f) => ({
      name: f.name,
      size: f.size,
      status: 'pending',
    }));
    setFiles((prev) => [...prev, ...mapped]);
    setGlobalStatus('idle');
    setStatusMessage('');
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    addFiles(dropped);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    addFiles(selected);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0 || isUploading) return;

    // Retrieve actual File objects from the input (we stored names)
    // Since we keep UploadedFile (no Blob), we need to re-pick from the DOM.
    // Instead, we store File objects in a parallel ref.
    // NOTE: We use the input element approach below; files are kept in pendingFilesRef.
    setIsUploading(true);
    setGlobalStatus('idle');

    // Mark all as uploading
    setFiles((prev) => prev.map((f) => ({ ...f, status: 'uploading' })));

    try {
      // We need real File objects — grab from pendingFilesRef
      const realFiles = pendingFilesRef.current;
      await uploadPDFs(realFiles);

      setFiles((prev) => prev.map((f) => ({ ...f, status: 'success' })));
      setGlobalStatus('success');
      setStatusMessage(
        `${realFiles.length} file${realFiles.length > 1 ? 's' : ''} processed successfully!`
      );
      onUploadSuccess?.(realFiles.length);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Upload failed. Try again.';
      setFiles((prev) => prev.map((f) => ({ ...f, status: 'error', error: msg })));
      setGlobalStatus('error');
      setStatusMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    pendingFilesRef.current = [];
    setGlobalStatus('idle');
    setStatusMessage('');
  };

  // Store real File objects in a ref alongside UploadedFile metadata
  const pendingFilesRef = useRef<File[]>([]);

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const pdfs = selected.filter(
      (f) => f.type === 'application/pdf' || f.name.endsWith('.pdf')
    );
    if (pdfs.length === 0) {
      setGlobalStatus('error');
      setStatusMessage('Only PDF files are supported.');
      return;
    }
    pendingFilesRef.current = [...pendingFilesRef.current, ...pdfs];
    const mapped: UploadedFile[] = pdfs.map((f) => ({
      name: f.name,
      size: f.size,
      status: 'pending',
    }));
    setFiles((prev) => [...prev, ...mapped]);
    setGlobalStatus('idle');
    setStatusMessage('');
    e.target.value = '';
  };

  const handleDropWithRef = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    const pdfs = dropped.filter(
      (f) => f.type === 'application/pdf' || f.name.endsWith('.pdf')
    );
    if (pdfs.length === 0) {
      setGlobalStatus('error');
      setStatusMessage('Only PDF files are supported.');
      return;
    }
    pendingFilesRef.current = [...pendingFilesRef.current, ...pdfs];
    const mapped: UploadedFile[] = pdfs.map((f) => ({
      name: f.name,
      size: f.size,
      status: 'pending',
    }));
    setFiles((prev) => [...prev, ...mapped]);
    setGlobalStatus('idle');
    setStatusMessage('');
  };

  const pendingCount = files.filter((f) => f.status === 'pending').length;
  const hasPending = pendingCount > 0;

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <motion.div
        id="pdf-drop-zone"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDropWithRef}
        onClick={() => inputRef.current?.click()}
        animate={{
          borderColor: isDragging ? '#3b82f6' : '#cbd5e1',
          backgroundColor: isDragging ? 'rgba(59,130,246,0.05)' : 'transparent',
        }}
        className="cursor-pointer border-2 border-dashed rounded-2xl p-5 flex flex-col items-center gap-2 transition-colors duration-200 dark:border-slate-700"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleFileInput}
          id="pdf-file-input"
        />

        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
            isDragging
              ? 'bg-blue-500 text-white'
              : 'bg-blue-50 dark:bg-blue-950/40 text-blue-500'
          }`}
        >
          <UploadCloud className="w-5 h-5" />
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {isDragging ? 'Drop PDFs here' : 'Drag & drop PDFs'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            or{' '}
            <span className="text-blue-500 font-medium">browse files</span>
          </p>
        </div>
      </motion.div>

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1.5 overflow-hidden"
          >
            {files.map((file, idx) => (
              <motion.div
                key={`${file.name}-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-red-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {/* Status icon */}
                {file.status === 'uploading' && (
                  <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin flex-shrink-0" />
                )}
                {file.status === 'success' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                )}
                {file.status === 'error' && (
                  <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                )}
                {file.status === 'pending' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                      pendingFilesRef.current = pendingFilesRef.current.filter(
                        (_, i) => i !== idx
                      );
                    }}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status message */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
              globalStatus === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
            }`}
          >
            {globalStatus === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
            )}
            {statusMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      {files.length > 0 && (
        <div className="flex gap-2">
          {hasPending && (
            <Button
              id="upload-button"
              onClick={handleUpload}
              isLoading={isUploading}
              size="sm"
              className="flex-1"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              {isUploading ? 'Processing…' : `Upload ${pendingCount} PDF${pendingCount > 1 ? 's' : ''}`}
            </Button>
          )}
          <Button
            id="clear-files-button"
            onClick={clearAll}
            variant="ghost"
            size="sm"
            disabled={isUploading}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
