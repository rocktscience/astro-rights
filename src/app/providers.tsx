'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, mounted]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-xl gradient-primary" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
