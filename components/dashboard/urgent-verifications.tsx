"use client"

import { formatRelativeTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ShieldCheck, Clock } from "lucide-react"
import { toast } from "sonner"

import { useStore } from "@/lib/store"

export function UrgentVerifications() {
  const { properties, verifyProperty } = useStore()

  // Filter properties that need verification: status is 'verification_required' 
  // or last_verified_at is older than 48 hours (simulated)
  const urgentProperties = properties.filter(p => 
    p.status === 'verification_required' || 
    (new Date().getTime() - new Date(p.last_verified).getTime() > 1000 * 60 * 60 * 48)
  )

  const handleVerify = (id: string, name: string) => {
    verifyProperty(id, "Ismail Bourhim", `Urgent verification completed for ${name}.`)
    toast.success(`Verification completed for ${name}`)
  }

  const handleContact = (name: string) => {
    toast.info(`Contacting owner of ${name}`, {
      description: "Initiating secure communication channel...",
    })
  }

  if (urgentProperties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/30">
        <ShieldCheck className="h-12 w-12 text-green-500 mb-4 opacity-50" />
        <h3 className="text-lg font-semibold">Inventory Fully Verified</h3>
        <p className="text-sm text-muted-foreground">All listings are up-to-date and transaction-ready.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-100 dark:bg-red-900/10 dark:border-red-900/20">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <p className="text-sm font-medium text-red-800 dark:text-red-400">
          {urgentProperties.length} properties require immediate attention to maintain listing freshness.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 text-left">
        {urgentProperties.map((property) => (
          <Card key={property.id} className="relative overflow-hidden group border-none shadow-md">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{property.title}</CardTitle>
                <Badge variant="error" className="text-[10px] uppercase font-bold">Overdue</Badge>
              </div>
              <CardDescription>{property.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last verified: {formatRelativeTime(property.last_verified)}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleVerify(property.id, property.title)}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Verify Now
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleContact(property.title)}
                >
                  Contact Owner
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
