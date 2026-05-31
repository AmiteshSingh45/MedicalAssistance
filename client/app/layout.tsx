import type { Metadata } from 'next';
import { Syne, Fira_Code } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const fira = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className={`${syne.variable} ${fira.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}