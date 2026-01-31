'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastContainer } from '@/components/ui/Toast';
import { useStore } from '@/store';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}

export function PageLayout({ children, title, description, icon: Icon, actions }: PageLayoutProps) {
  const { sidebarCollapsed } = useStore();

  return (
    <div className="min-h-screen bg-black">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/20 via-black to-cyan-950/10 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none" />
      
      <Sidebar />
      <ToastContainer />

      <main
        className="relative transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
      >
        <div className="p-8 max-w-[1600px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-2"
              >
                {Icon && (
                  <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                )}
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {title}
                </h1>
              </motion.div>
              {description && (
                <p className="text-zinc-500 text-lg">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
