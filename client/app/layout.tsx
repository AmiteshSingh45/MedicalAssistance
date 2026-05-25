import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MediBot AI — Medical RAG Assistant',
  description:
    'AI-powered medical document assistant. Upload your medical PDFs and get accurate, cited answers using RAG with Groq LLM and Pinecone vector search.',
  keywords: ['medical AI', 'RAG', 'medical assistant', 'PDF Q&A', 'Groq', 'Pinecone'],
  openGraph: {
    title: 'MediBot AI — Medical RAG Assistant',
    description: 'AI-powered medical document Q&A with source citations.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
