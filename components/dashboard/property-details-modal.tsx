"use client"

import { Property } from "@/lib/types"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatRelativeTime, getStatusInfo } from "@/lib/utils"
import { Building2, MapPin, ShieldCheck, History } from "lucide-react"

export function PropertyDetailsModal({ 
  property, 
  open, 
  onOpenChange 
}: { 
  property: Property | null, 
  open: boolean, 
  onOpenChange: (open: boolean) => void 
}) {
  if (!property) return null

  const status = getStatusInfo(property.status)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        <div className="h-32 bg-primary/5 relative">
          <div className="absolute -bottom-6 left-8 h-20 w-20 rounded-xl bg-card border-4 border-background flex items-center justify-center shadow-md">
            <Building2 className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <div className="pt-10 px-8 pb-8 space-y-8 text-left">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">{property.title || "Untitled Property"}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{property.location || "No Location Specified"}</span>
              </div>
            </div>
            <Badge variant={status.variant} className="text-xs uppercase font-bold py-1 px-3">
              {status.label}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-6 bg-muted/30 p-4 rounded-lg border border-border/50">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Live Database ID</p>
              <p className="text-[11px] font-mono font-medium truncate" title={property.id}>{property.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cloud Valuation</p>
              <p className="text-sm font-bold text-primary">{formatCurrency(property.price || 0)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Category</p>
              <p className="text-sm font-medium">{property.type || "Not Categorized"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 border-t pt-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                Verification Status
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Last Audit</span>
                  <span className="font-medium">{formatRelativeTime(property.last_verified)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Owner Confirmed</span>
                  <Badge variant={property.owner_confirmed ? "success" : "error"} className="h-5 text-[9px]">
                    {property.owner_confirmed ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Agent Certified</span>
                  <Badge variant={property.agent_confirmed ? "success" : "error"} className="h-5 text-[9px]">
                    {property.agent_confirmed ? "Certified" : "Pending"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <History className="h-4 w-4 text-primary" />
                Quick Metadata
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Created At</span>
                  <span className="font-medium">{new Date(property.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Assigned Agent</span>
                  <span className="font-medium">{property.assigned_agent || "Not Assigned"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Internal Code</span>
                  <span className="font-medium font-mono">{property.property_code || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
