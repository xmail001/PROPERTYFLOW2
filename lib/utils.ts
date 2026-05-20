import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(dateString: string | null | undefined) {
  if (!dateString) return 'Never'
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (isNaN(diffInSeconds)) return 'Invalid date';
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  } catch {
    return 'Date error'
  }
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function downloadCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => 
    Object.values(obj)
      .map(val => (typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val))
      .join(',')
  );
  
  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * BULLETPROOF STATUS LOOKUP
 * This function is guaranteed to return an object with label and variant.
 * It prevents the "Cannot read properties of undefined (reading 'variant')" crash.
 */
export const getStatusInfo = (status: string | null | undefined) => {
  const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "error" | "secondary" | "info" }> = {
    available: { label: "Available", variant: "success" },
    reserved: { label: "Reserved", variant: "warning" },
    under_negotiation: { label: "Negotiation", variant: "info" },
    undernegotiation: { label: "Negotiation", variant: "info" },
    sold: { label: "Sold", variant: "error" },
    inactive: { label: "Inactive", variant: "secondary" },
    verification_required: { label: "Pending Audit", variant: "error" },
    verificationrequired: { label: "Pending Audit", variant: "error" },
    pending: { label: "Pending Audit", variant: "error" },
  }

  if (!status) {
    return { label: "No Status", variant: "default" as const }
  }

  // Normalize: Lowercase, remove spaces, remove special chars
  const key = status.toLowerCase().replace(/[^a-z]/g, '')
  
  return statusConfig[key] || { label: status, variant: "default" as const }
}

export function getInitials(name: string) {
  if (!name) return "U"
  const parts = name.split(" ")
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
  }
  return parts[0].charAt(0).toUpperCase()
}
