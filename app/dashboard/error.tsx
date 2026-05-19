'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an analytics service
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center p-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30">
        <AlertCircle className="h-10 w-10 text-red-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Technical Error Detected</h2>
        <p className="text-muted-foreground max-w-[450px]">
          Something went wrong while loading the dashboard. This is likely related to the browser environment sync.
        </p>
      </div>
      <div className="p-4 rounded-lg bg-muted font-mono text-[10px] text-red-500 max-w-full overflow-auto border">
        {error.message || "Unknown Runtime Error"}
      </div>
      <Button onClick={() => reset()} variant="outline">
        <RotateCcw className="mr-2 h-4 w-4" />
        Attempt System Recovery
      </Button>
    </div>
  )
}
