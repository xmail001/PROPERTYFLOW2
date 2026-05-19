"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const SettingsContent = dynamic(
  () => import("@/components/dashboard/settings-content").then((mod) => mod.SettingsContent),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading system settings...
        </p>
      </div>
    )
  }
)

export default function SettingsPage() {
  return <SettingsContent />
}
