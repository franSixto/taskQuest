import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'TaskQuest - Gamified Task Manager',
  description: 'Transform your productivity into an epic RPG adventure. Complete quests, defeat bosses, level up your skills.',
  keywords: ['task manager', 'productivity', 'gamification', 'RPG', 'todo', 'habits'],
  authors: [{ name: 'TaskQuest' }],
  openGraph: {
    title: 'TaskQuest - Gamified Task Manager',
    description: 'Transform your productivity into an epic RPG adventure',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0E27',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <div className="cyber-grid min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
