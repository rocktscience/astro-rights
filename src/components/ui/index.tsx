'use client';

import { forwardRef, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ===== MODAL COMPONENT =====
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function Modal({ isOpen, onClose, title, description, children, size = 'md' }: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-7xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative w-full',
              sizeClasses[size],
              'bg-zinc-900/95 backdrop-blur-xl',
              'border border-white/10',
              'rounded-2xl shadow-2xl shadow-black/50',
              'max-h-[85vh] overflow-hidden'
            )}
          >
            {/* Gradient border glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            {title && (
              <div className="relative flex items-start justify-between px-6 py-5 border-b border-white/5">
                <div>
                  <h2 className="text-lg font-semibold text-white tracking-tight">{title}</h2>
                  {description && (
                    <p className="mt-1 text-sm text-zinc-400">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="relative overflow-y-auto max-h-[calc(85vh-80px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ===== BUTTON COMPONENT =====
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  glow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, glow, ...props }, ref) => {
    const variants = {
      primary: cn(
        'bg-gradient-to-r from-violet-600 to-violet-500 text-white',
        'hover:from-violet-500 hover:to-violet-400',
        'shadow-lg shadow-violet-500/25',
        'border border-violet-400/20',
        glow && 'hover:shadow-violet-500/40'
      ),
      secondary: cn(
        'bg-white/5 text-zinc-100',
        'hover:bg-white/10',
        'border border-white/10',
        'hover:border-white/20'
      ),
      ghost: cn(
        'bg-transparent text-zinc-400',
        'hover:bg-white/5 hover:text-zinc-100'
      ),
      danger: cn(
        'bg-gradient-to-r from-red-600 to-red-500 text-white',
        'hover:from-red-500 hover:to-red-400',
        'shadow-lg shadow-red-500/25',
        'border border-red-400/20'
      ),
      outline: cn(
        'bg-transparent text-zinc-300',
        'border border-white/10',
        'hover:bg-white/5 hover:border-white/20'
      ),
    };

    const sizes = {
      xs: 'px-2.5 py-1 text-xs gap-1',
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center',
          'rounded-lg font-medium',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ===== INPUT COMPONENT =====
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg',
              'bg-white/5 text-zinc-100',
              'border border-white/10',
              'placeholder:text-zinc-500',
              'transition-all duration-200',
              'hover:border-white/20',
              'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
              error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-zinc-500">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ===== TEXTAREA COMPONENT =====
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-lg',
            'bg-white/5 text-zinc-100',
            'border border-white/10',
            'placeholder:text-zinc-500',
            'transition-all duration-200',
            'hover:border-white/20',
            'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
            'resize-none',
            error && 'border-red-500/50 focus:ring-red-500/50',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-zinc-500">{helperText}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// ===== SELECT COMPONENT =====
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg',
              'bg-white/5 text-zinc-100',
              'border border-white/10',
              'transition-all duration-200',
              'hover:border-white/20',
              'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
              'appearance-none cursor-pointer',
              error && 'border-red-500/50',
              className
            )}
            {...props}
          >
            {options.map((option, idx) => (
              <option key={`${option.value}-${idx}`} value={option.value} className="bg-zinc-900">
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

// ===== BADGE COMPONENT =====
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'violet' | 'cyan';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', dot, className }: BadgeProps) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  const dotColors = {
    default: 'bg-zinc-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-red-400',
    info: 'bg-blue-400',
    violet: 'bg-violet-400',
    cyan: 'bg-cyan-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium border',
      variants[variant],
      sizes[size],
      className
    )}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}

// ===== CHECKBOX COMPONENT =====
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className={cn(
              'peer w-5 h-5 rounded',
              'bg-white/5 border border-white/20',
              'checked:bg-violet-600 checked:border-violet-600',
              'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950',
              'transition-all duration-200 cursor-pointer appearance-none',
              className
            )}
            {...props}
          />
          <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
        </div>
        {label && (
          <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
            {label}
          </span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// ===== CARD COMPONENT =====
interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, padding = 'md', hover, glow }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={cn(
      'relative rounded-xl',
      'bg-white/[0.02] backdrop-blur-sm',
      'border border-white/[0.05]',
      hover && 'hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300',
      glow && 'hover:shadow-lg hover:shadow-violet-500/5',
      paddings[padding],
      className
    )}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

// ===== STAT CARD COMPONENT =====
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
  href?: string;
  color?: 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose';
}

export function StatCard({ label, value, icon, trend, trendUp, color = 'violet' }: StatCardProps) {
  const colorClasses = {
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      text: 'text-violet-400',
      glow: 'group-hover:shadow-violet-500/20',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      text: 'text-cyan-400',
      glow: 'group-hover:shadow-cyan-500/20',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'group-hover:shadow-emerald-500/20',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'group-hover:shadow-amber-500/20',
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      glow: 'group-hover:shadow-rose-500/20',
    },
  };

  const colors = colorClasses[color];

  return (
    <Card hover className={cn('group transition-all duration-300', colors.glow)}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-xl border', colors.bg, colors.border)}>
          <div className={colors.text}>
            {icon}
          </div>
        </div>
        {trend && (
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
            trendUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
          )}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
    </Card>
  );
}

// ===== TABS COMPONENT =====
interface TabsProps {
  tabs: Array<{ id: string; label: string; count?: number }>;
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="inline-flex gap-1 p-1 bg-white/5 rounded-lg border border-white/5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
            activeTab === tab.id
              ? 'text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white/10 rounded-md"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                'px-1.5 py-0.5 text-xs rounded',
                activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
              )}>
                {tab.count}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

// ===== EMPTY STATE COMPONENT =====
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="mb-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-zinc-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-zinc-400 mb-6 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  );
}

// ===== SKELETON LOADER COMPONENT =====
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn(
      'bg-white/5 rounded animate-pulse',
      className
    )} />
  );
}

// ===== DATA TABLE COMPONENT =====
interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyState?: ReactNode;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string }>({ 
  columns, 
  data, 
  onRowClick, 
  emptyState,
  isLoading 
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/5 overflow-hidden">
        <div className="bg-white/[0.02]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-white/5 last:border-0">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 overflow-hidden bg-white/[0.01]">
        {emptyState || (
          <EmptyState
            title="No data found"
            description="There are no items to display"
          />
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-white/[0.02]',
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'bg-white/[0.01] transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-white/[0.03]'
                )}
              >
                {columns.map((column) => (
                  <td key={column.key} className={cn('px-6 py-4', column.className)}>
                    {column.render 
                      ? column.render(item) 
                      : String((item as Record<string, unknown>)[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== ALERT COMPONENT =====
interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const variants = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: <Info className="w-5 h-5 text-blue-400" />,
    },
    success: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: <Check className="w-5 h-5 text-emerald-400" />,
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: <AlertCircle className="w-5 h-5 text-red-400" />,
    },
  };

  const styles = variants[variant];

  return (
    <div className={cn(
      'flex gap-3 p-4 rounded-xl border',
      styles.bg,
      styles.border,
      className
    )}>
      {styles.icon}
      <div>
        {title && <p className="font-medium text-white mb-1">{title}</p>}
        <div className="text-sm text-zinc-300">{children}</div>
      </div>
    </div>
  );
}

// ===== DIVIDER COMPONENT =====
interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return (
    <div className={cn('h-px bg-gradient-to-r from-transparent via-white/10 to-transparent', className)} />
  );
}
