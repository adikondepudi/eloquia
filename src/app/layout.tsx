import { ClerkProvider } from '@clerk/nextjs';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { MainNav } from '@/components/navigation/main-nav';
import './globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <body className="min-h-screen bg-background font-sans antialiased">
          <div className="relative flex min-h-screen flex-col">
            <MainNav />
            <main className="flex-1">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}