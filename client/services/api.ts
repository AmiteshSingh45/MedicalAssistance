import axios from 'axios';
import { AskResponse, UploadResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 min — LLM can be slow
});

/**
 * Upload one or more PDF files to the backend.
 * Backend expects multipart/form-data with field name "files".
 */
export async function uploadPDFs(files: File[]): Promise<UploadResponse> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await apiClient.post<UploadResponse>('/upload_pdfs/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

/**
 * Ask a medical question. Backend expects application/x-www-form-urlencoded
 * with field name "question" (FastAPI Form field — NOT JSON body).
 */
export async function askQuestion(question: string): Promise<AskResponse> {
  const params = new URLSearchParams();
  params.append('question', question);

  const response = await apiClient.post<AskResponse>('/ask/', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return response.data;
}

export default apiClient;
