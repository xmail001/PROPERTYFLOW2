"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const PropertiesContent = dynamic(
  () => import("@/components/dashboard/properties-content").then((mod) => mod.PropertiesContent),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading property inventory...
        </p>
      </div>
    )
  }
)

export default function PropertiesPage() {
  return <PropertiesContent />
}
