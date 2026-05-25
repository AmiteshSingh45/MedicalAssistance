// TypeScript interfaces for Medical AI RAG

export interface UploadResponse {
  messages: string;
}

export interface UploadError {
  error: string;
}

export interface AnswerSchema {
  title: string;
  content: string;
  disclaimer: string;
}

export interface AskResponse {
  success: boolean;
  question: string;
  answer: AnswerSchema;
  sources: string[];
}

export interface AskError {
  success: false;
  error: string;
}

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  sources?: string[];
  disclaimer?: string;
  answerTitle?: string;
  timestamp: Date;
  isLoading?: boolean;
  isError?: boolean;
}

export interface ParsedSource {
  filename: string;
  page: string | number;
  raw: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}
