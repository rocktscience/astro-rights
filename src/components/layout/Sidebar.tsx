'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import {
  LayoutDashboard,
  Music,
  Users,
  Mic2,
  Building2,
  Disc3,
  FileText,
  DollarSign,
  Settings,
  Upload,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Album,
  CircleDot,
  FileSignature,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { href: '/works', label: 'Works', icon: Music },
      { href: '/writers', label: 'Writers', icon: Users },
      { href: '/recordings', label: 'Recordings', icon: Disc3 },
      { href: '/artists', label: 'Artists', icon: Mic2 },
    ],
  },
  {
    label: 'Rights',
    items: [
      { href: '/publishers', label: 'Publishers', icon: Building2 },
      { href: '/labels', label: 'Labels', icon: CircleDot },
      { href: '/releases', label: 'Releases', icon: Album },
      { href: '/agreements', label: 'Agreements', icon: FileSignature },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/cwr', label: 'CWR Exports', icon: FileText },
      { href: '/royalties', label: 'Royalties', icon: DollarSign },
      { href: '/import', label: 'Import', icon: Upload },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname() ?? '/';
  const sidebarCollapsed = useStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'fixed left-0 top-0 h-screen z-40',
        'flex flex-col',
        'bg-black/40 backdrop-blur-xl',
        'border-r border-white/[0.06]'
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center h-16 px-4 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-3 overflow-hidden group">
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-xl',
            'bg-gradient-to-br from-violet-600 to-violet-500',
            'flex items-center justify-center',
            'shadow-lg shadow-violet-500/30',
            'group-hover:shadow-violet-500/50 transition-shadow duration-300'
          )}>
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col min-w-0"
              >
                <span className="font-semibold text-sm text-white whitespace-nowrap tracking-tight">
                  ASTRO
                </span>
                <span className="text-[11px] text-zinc-500 whitespace-nowrap">
                  Rights Admin
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navGroups.map((group, groupIndex) => (
          <div key={group.label} className={cn(groupIndex > 0 && 'mt-6')}>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-2 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={cn(
                        'relative flex items-center gap-3 px-3 py-2.5 rounded-lg',
                        'transition-all duration-200',
                        isActive
                          ? 'text-white'
                          : 'text-zinc-500 hover:text-zinc-200'
                      )}
                    >
                      {/* Active background */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavBg"
                          className={cn(
                            'absolute inset-0 rounded-lg',
                            'bg-white/[0.08]',
                            'border border-white/[0.06]'
                          )}
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      
                      {/* Hover background */}
                      {!isActive && hoveredItem === item.href && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 rounded-lg bg-white/[0.04]"
                        />
                      )}

                      {/* Icon */}
                      <Icon className={cn(
                        'w-[18px] h-[18px] flex-shrink-0 relative z-10',
                        isActive && 'text-violet-400'
                      )} />

                      {/* Label */}
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="text-sm font-medium whitespace-nowrap relative z-10"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Active indicator line */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicatorLine"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-violet-500 rounded-r-full"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      
                      {/* Tooltip for collapsed state */}
                      {sidebarCollapsed && hoveredItem === item.href && (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          className={cn(
                            'absolute left-full ml-3 px-3 py-1.5',
                            'bg-zinc-900 border border-white/10',
                            'text-white text-xs font-medium',
                            'rounded-lg whitespace-nowrap z-50',
                            'shadow-xl shadow-black/50'
                          )}
                        >
                          {item.label}
                        </motion.div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="p-3 border-t border-white/[0.06] space-y-1">
        {/* Settings Link */}
        <Link
          href="/settings"
          onMouseEnter={() => setHoveredItem('/settings')}
          onMouseLeave={() => setHoveredItem(null)}
          className={cn(
            'relative flex items-center gap-3 px-3 py-2.5 rounded-lg',
            'text-zinc-500 hover:text-zinc-200',
            'transition-all duration-200',
            pathname === '/settings' && 'text-white bg-white/[0.08]'
          )}
        >
          <Settings className={cn(
            'w-[18px] h-[18px] flex-shrink-0',
            pathname === '/settings' && 'text-violet-400'
          )} />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
          
          {sidebarCollapsed && hoveredItem === '/settings' && (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                'absolute left-full ml-3 px-3 py-1.5',
                'bg-zinc-900 border border-white/10',
                'text-white text-xs font-medium',
                'rounded-lg whitespace-nowrap z-50'
              )}
            >
              Settings
            </motion.div>
          )}
        </Link>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
            'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]',
            'transition-all duration-200'
          )}
        >
          <motion.div
            animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft className="w-[18px] h-[18px] flex-shrink-0" />
          </motion.div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Gradient glow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-violet-600/5 to-transparent pointer-events-none" />
    </motion.aside>
  );
}
