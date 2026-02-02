import { type ClassValue, clsx } from 'clsx';

// Combine class names with clsx (simple implementation without tailwind-merge for now)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Format percentage
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

// Format duration in seconds to HH:MM:SS or MM:SS
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Format date
export function formatDate(date: Date | string, format: 'short' | 'long' | 'iso' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'long':
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'iso':
      return d.toISOString().split('T')[0];
    default:
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  }
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  
  return formatDate(d);
}

// Validate ISWC format
export function validateISWC(iswc: string): boolean {
  // ISWC format: T-123456789-C (where C is a check digit)
  const pattern = /^T-?\d{9}-?\d$/i;
  return pattern.test(iswc.replace(/[\s-]/g, ''));
}

// Format ISWC
export function formatISWC(iswc: string): string {
  const clean = iswc.replace(/[\s-]/g, '').toUpperCase();
  if (clean.length === 11 && clean.startsWith('T')) {
    return `${clean[0]}-${clean.slice(1, 10)}-${clean[10]}`;
  }
  return iswc;
}

// Validate ISRC format
export function validateISRC(isrc: string): boolean {
  // ISRC format: CC-XXX-YY-NNNNN
  const pattern = /^[A-Z]{2}-?[A-Z0-9]{3}-?\d{2}-?\d{5}$/i;
  return pattern.test(isrc);
}

// Format ISRC
export function formatISRC(isrc: string): string {
  const clean = isrc.replace(/-/g, '').toUpperCase();
  if (clean.length === 12) {
    return `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5, 7)}-${clean.slice(7)}`;
  }
  return isrc;
}

// Validate IPI Name Number
export function validateIPINameNumber(ipi: string): boolean {
  // IPI Name Number is 11 digits
  const clean = ipi.replace(/\D/g, '');
  return clean.length === 11;
}

// Generate work ID
export function generateWorkId(prefix: string, sequence: number): string {
  return `${prefix}${String(sequence).padStart(5, '0')}`;
}

// Slugify string
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Truncate string
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length - 3) + '...';
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Parse number or return undefined (preserve zero)
export function parseNumberOrUndefined(value?: string | number): number | undefined {
  if (value === undefined || value === null) return undefined;
  const s = typeof value === 'number' ? value : value.toString().trim();
  if (s === '') return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

// Debounce function
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Get status color class
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    registered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    conflict: 'bg-red-500/20 text-red-400 border-red-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    RA: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    AS: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    RC: 'bg-red-500/20 text-red-400 border-red-500/30',
    DU: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    CO: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  
  return colors[status] || colors.draft;
}

// Get writer capacity label
export function getWriterCapacityLabel(capacity: string): string {
  const labels: Record<string, string> = {
    CA: 'Composer/Author',
    C: 'Composer',
    A: 'Author',
    AD: 'Adapter',
    AR: 'Arranger',
    SA: 'Sub-Author',
    SR: 'Sub-Arranger',
    TR: 'Translator',
  };
  
  return labels[capacity] || capacity;
}

// Get publisher role label
export function getPublisherRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    E: 'Original Publisher',
    AM: 'Administrator',
    SE: 'Sub-Publisher',
    PA: 'Income Participant',
  };
  
  return labels[role] || role;
}

// Calculate total shares
export function calculateTotalShares(
  shares: Array<{ prOwnership: number; mrOwnership: number; srOwnership: number }>
): { pr: number; mr: number; sr: number } {
  return shares.reduce(
    (acc, share) => ({
      pr: acc.pr + share.prOwnership,
      mr: acc.mr + share.mrOwnership,
      sr: acc.sr + share.srOwnership,
    }),
    { pr: 0, mr: 0, sr: 0 }
  );
}

// Download file
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Read file as text
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
