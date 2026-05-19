"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const VerificationsContent = dynamic(
  () => import("@/components/dashboard/verifications-content").then((mod) => mod.VerificationsContent),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading audit logs...
        </p>
      </div>
    )
  }
)

export default function VerificationsPage() {
  return <VerificationsContent />
}
