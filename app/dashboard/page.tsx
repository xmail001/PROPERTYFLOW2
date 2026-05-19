"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

// Import the dashboard content dynamically with SSR disabled.
// This prevents hydration errors and crashes on Vercel caused by browser-only APIs.
const DashboardContent = dynamic(
  () => import("@/components/dashboard/dashboard-content").then((mod) => mod.DashboardContent),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Initialising secure dashboard environment...
        </p>
      </div>
    )
  }
)

export default function DashboardPage() {
  return <DashboardContent />
}
