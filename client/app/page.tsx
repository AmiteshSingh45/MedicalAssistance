'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sidebar,
} from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';

// ─── Floating orb backgrounds ───────────────────────────────────────────────
function CosmicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {/* Primary deep gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(6,182,212,0.12) 0%, transparent 60%), ' +
            'radial-gradient(ellipse 60% 40% at 80% 80%, rgba(20,184,166,0.08) 0%, transparent 55%), ' +
            'linear-gradient(160deg, #020a10 0%, #030d17 40%, #020b12 100%)',
        }}
      />

      {/* Animated orb 1 — teal */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 520,
          height: 520,
          top: '-140px',
          left: '-80px',
          background:
            'radial-gradient(circle, rgba(6,182,212,0.13) 0%, rgba(6,182,212,0.04) 45%, transparent 70%)',
          filter: 'blur(1px)',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Animated orb 2 — emerald */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          bottom: '5%',
          right: '-60px',
          background:
            'radial-gradient(circle, rgba(16,185,129,0.11) 0%, rgba(16,185,129,0.03) 50%, transparent 70%)',
          filter: 'blur(2px)',
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), ' +
            'linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Scanline top edge */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.4) 30%, rgba(20,184,166,0.6) 50%, rgba(6,182,212,0.4) 70%, transparent 100%)',
        }}
      />
    </div>
  );
}

// ─── Sidebar mobile overlay ───────────────────────────────────────────────────
function MobileOverlay({ show, onClose }: { show: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
    </AnimatePresence>
  );
}

// ─── Pulse ring — decorative AI "heartbeat" ───────────────────────────────────
function PulseRing() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-cyan-500/10"
          style={{ width: 300 + i * 180, height: 300 + i * 180 }}
          animate={{ scale: [0.94, 1.04, 0.94], opacity: [0.3, 0.06, 0.3] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
        />
      ))}
    </div>
  );
}

// ─── Status bar at the very top ───────────────────────────────────────────────
function SystemStatusBar({ uploadedCount }: { uploadedCount: number }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="relative z-20 flex items-center justify-between px-4 py-1.5"
      style={{
        background: 'rgba(2,10,16,0.8)',
        borderBottom: '1px solid rgba(6,182,212,0.12)',
        backdropFilter: 'blur(12px)',
      }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left: system name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span
            className="font-mono text-emerald-400/80"
            style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}
          >
            SYS:ONLINE
          </span>
        </div>
        <span style={{ color: 'rgba(6,182,212,0.25)', fontSize: '0.6rem' }}>|</span>
        <span
          className="font-mono"
          style={{ fontSize: '0.65rem', color: 'rgba(6,182,212,0.5)', letterSpacing: '0.1em' }}
        >
          MEDIBOT-RAG v2.0
        </span>
      </div>

      {/* Right: live counters */}
      <div className="flex items-center gap-4">
        <span
          className="font-mono"
          style={{ fontSize: '0.65rem', color: 'rgba(6,182,212,0.45)', letterSpacing: '0.08em' }}
        >
          DOCS:{' '}
          <span className="text-cyan-400/70">{String(uploadedCount).padStart(2, '0')}</span>
        </span>
        <span
          className="font-mono"
          style={{ fontSize: '0.65rem', color: 'rgba(6,182,212,0.35)', letterSpacing: '0.08em' }}
        >
          {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const [uploadedCount, setUploadedCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleUploadSuccess = (count: number) => {
    setUploadedCount((prev) => prev + count);
  };

  return (
    <div
      className="relative flex h-screen flex-col overflow-hidden"
      style={{ fontFamily: 'var(--font-syne), sans-serif' }}
    >
      {/* Deep-space background */}
      <CosmicBackground />

      {/* Top system bar */}
      <SystemStatusBar uploadedCount={uploadedCount} />

      {/* Body */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* ── Sidebar (desktop always-visible, mobile drawer) ── */}
        <AnimatePresence>
          <motion.aside
            key="sidebar"
            className={`
              fixed md:relative inset-y-0 left-0 z-40
              flex flex-col
              w-72 flex-shrink-0
              md:translate-x-0
            `}
            style={{
              background: 'rgba(2,14,22,0.75)',
              borderRight: '1px solid rgba(6,182,212,0.1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '4px 0 32px rgba(0,0,0,0.4), inset -1px 0 0 rgba(6,182,212,0.06)',
            }}
            initial={{ x: -288 }}
            animate={{ x: sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 768) ? 0 : -288 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Sidebar top accent line */}
            <div
              className="h-px w-full flex-shrink-0"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(6,182,212,0.5) 40%, rgba(20,184,166,0.7) 60%, transparent)',
              }}
            />

            {/* Sidebar header */}
            <div className="flex items-center gap-3 px-5 py-4">
              {/* Logo mark */}
              <div
                className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(20,184,166,0.1))',
                  border: '1px solid rgba(6,182,212,0.25)',
                  boxShadow: '0 0 16px rgba(6,182,212,0.15)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L12 6M12 18L12 22M2 12L6 12M18 12L22 12" stroke="rgba(6,182,212,0.9)" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="4" stroke="rgba(20,184,166,0.9)" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="1.5" fill="rgba(6,182,212,0.9)"/>
                </svg>
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{ border: '1px solid rgba(6,182,212,0.4)', borderRadius: '12px' }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>

              <div>
                <h1
                  className="font-bold leading-none tracking-wide"
                  style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)', letterSpacing: '0.05em' }}
                >
                  MEDIBOT
                  <span style={{ color: 'rgba(6,182,212,0.9)' }}> AI</span>
                </h1>
                <p
                  className="font-mono mt-0.5"
                  style={{ fontSize: '0.62rem', color: 'rgba(6,182,212,0.5)', letterSpacing: '0.12em' }}
                >
                  RAG · GROQ · PINECONE
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px" style={{ background: 'rgba(6,182,212,0.08)' }} />

            {/* Sidebar content from your existing Sidebar component */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <Sidebar
                uploadedCount={uploadedCount}
                onUploadSuccess={handleUploadSuccess}
              />
            </div>

            {/* Sidebar bottom pulse rings */}
            <div className="relative h-32 flex-shrink-0 overflow-hidden">
              <PulseRing />
            </div>
          </motion.aside>
        </AnimatePresence>

        {/* Mobile overlay */}
        <MobileOverlay show={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* ── Main chat column ── */}
        <div className="relative flex flex-1 flex-col overflow-hidden">

          {/* Header */}
          <div
            className="relative z-10 flex-shrink-0"
            style={{
              background: 'rgba(2,12,20,0.6)',
              borderBottom: '1px solid rgba(6,182,212,0.08)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Mobile sidebar toggle */}
            <div className="flex items-center gap-3 px-4 py-3 md:hidden">
              <button
                onClick={() => setSidebarOpen((o) => !o)}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                style={{
                  background: 'rgba(6,182,212,0.08)',
                  border: '1px solid rgba(6,182,212,0.15)',
                  color: 'rgba(6,182,212,0.7)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
              <span
                className="font-bold tracking-widest"
                style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.15em' }}
              >
                MEDIBOT <span style={{ color: 'rgba(6,182,212,0.8)' }}>AI</span>
              </span>
            </div>

            {/* Your existing Header component */}
            <Header onClearChat={clearChat} messageCount={messages.length} />
          </div>

          {/* Chat surface */}
          <motion.div
            className="relative flex flex-1 flex-col overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Subtle vignette to give depth */}
            <div
              className="pointer-events-none absolute inset-0 z-0"
              aria-hidden
              style={{
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(2,10,16,0.4) 100%)',
              }}
            />

            {/* Chat messages */}
            <div className="relative z-10 flex-1 overflow-hidden">
              <ChatWindow messages={messages} />
            </div>

            {/* Input zone */}
            <div
              className="relative z-10 flex-shrink-0 px-4 pb-5 pt-3"
              style={{
                background:
                  'linear-gradient(0deg, rgba(2,10,16,0.95) 60%, rgba(2,10,16,0) 100%)',
              }}
            >
              {/* Upload count badge above input when docs are loaded */}
              <AnimatePresence>
                {uploadedCount > 0 && (
                  <motion.div
                    className="mb-2.5 flex justify-center"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1"
                      style={{
                        background: 'rgba(16,185,129,0.08)',
                        border: '1px solid rgba(16,185,129,0.2)',
                      }}
                    >
                      <motion.div
                        className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span
                        className="font-mono"
                        style={{ fontSize: '0.68rem', color: 'rgba(52,211,153,0.85)', letterSpacing: '0.08em' }}
                      >
                        {uploadedCount} document{uploadedCount !== 1 ? 's' : ''} indexed · RAG active
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Glowing border wrapper around input */}
              <div
                className="relative rounded-2xl"
                style={{
                  background: 'rgba(2,16,26,0.8)',
                  border: '1px solid rgba(6,182,212,0.18)',
                  boxShadow:
                    '0 0 0 1px rgba(6,182,212,0.04), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(6,182,212,0.06)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Animated top border glow */}
                <motion.div
                  className="absolute left-8 right-8 top-0 h-px rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(6,182,212,0.6), rgba(20,184,166,0.8), rgba(6,182,212,0.6), transparent)',
                  }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                <ChatInput onSend={sendMessage} isLoading={isLoading} />
              </div>

              {/* Disclaimer */}
              <p
                className="mt-3 text-center font-mono"
                style={{ fontSize: '0.6rem', color: 'rgba(6,182,212,0.25)', letterSpacing: '0.1em' }}
              >
                ANSWERS GROUNDED IN INDEXED DOCUMENTS · NOT MEDICAL ADVICE
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}