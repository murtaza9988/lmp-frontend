// app/layout.jsx
import { Inter } from 'next/font/google';
import './globals.css';
import ClientWrapper from './ClientWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Backlink Marketplace - Buy & Sell Quality Backlinks',
  description:
    'The premier marketplace for buying and selling high-quality backlinks. Connect with website owners and boost your SEO with our trusted platform.',
  keywords: 'backlinks, SEO, link building, digital marketing, website traffic',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}