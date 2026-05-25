'use client';

import { useState, useCallback } from 'react';
import { Message } from '@/types';
import { askQuestion } from '@/services/api';
import { generateId } from '@/lib/utils';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: question.trim(),
      timestamp: new Date(),
    };

    // Loading placeholder for AI response
    const loadingMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const data = await askQuestion(question.trim());

      const aiMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.answer?.content ?? 'No response received.',
        answerTitle: data.answer?.title,
        disclaimer: data.answer?.disclaimer,
        sources: data.sources ?? [],
        timestamp: new Date(),
        isLoading: false,
        isError: !data.success,
      };

      // Replace the loading placeholder with the real response
      setMessages((prev) => [
        ...prev.filter((m) => !m.isLoading),
        aiMessage,
      ]);
    } catch (error: unknown) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred. Please check the server connection.',
        timestamp: new Date(),
        isLoading: false,
        isError: true,
      };

      setMessages((prev) => [
        ...prev.filter((m) => !m.isLoading),
        errorMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, sendMessage, clearChat };
}
