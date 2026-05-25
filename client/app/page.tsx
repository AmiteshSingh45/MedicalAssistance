'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';

export default function HomePage() {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleUploadSuccess = (count: number) => {
    setUploadedCount((prev) => prev + count);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar
        uploadedCount={uploadedCount}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          onClearChat={clearChat}
          messageCount={messages.length}
        />

        {/* Chat window — fills remaining space */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatWindow messages={messages} />
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
