"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ShieldCheck, ExternalLink, History, Loader2, Trash } from "lucide-react"
import { formatRelativeTime } from "@/lib/utils"
import { toast } from "sonner"

import { useStore } from "@/lib/store"

const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "error" | "secondary" | "info" }> = {
  available: { label: "Available", variant: "success" },
  reserved: { label: "Reserved", variant: "warning" },
  under_negotiation: { label: "Negotiation", variant: "info" },
  sold: { label: "Sold", variant: "error" },
  inactive: { label: "Inactive", variant: "secondary" },
  verification_required: { label: "Pending Audit", variant: "error" },
}

export function PropertyTable({ search = "" }: { search?: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const { properties, verifyProperty, deleteProperty, settings } = useStore()

  // ULTRA SAFE STATUS LOOKUP
  const getStatusInfo = (status: string | null | undefined) => {
    if (!status) return { label: "No Status", variant: "default" as const }
    
    // Convert "Under Negotiation" to "under_negotiation"
    const key = status.toLowerCase().replace(/\s+/g, '_')
    
    return statusConfig[key] || { label: status, variant: "default" as const }
  }

  const filteredProperties = properties.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.toLowerCase().includes(search.toLowerCase()) ||
    p.id?.toLowerCase().includes(search.toLowerCase())
  )

  const handleVerify = async (id: string) => {
    setLoadingId(id)
    try {
      await verifyProperty(id, settings.userName, "Manual verification performed.")
      setLoadingId(null)
      toast.success("Property verified successfully")
    } catch (error) {
      console.error(error)
      setLoadingId(null)
      toast.error("Verification failed")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      await deleteProperty(id)
      toast.success("Property removed")
    }
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[300px]">Property</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Verified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => {
              const info = getStatusInfo(property.status)
              return (
                <TableRow key={property.id} className="group transition-colors hover:bg-muted/50">
                  <TableCell className="font-medium text-left">
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold">{property.title}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">REF: {property.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground text-left">{property.location}</TableCell>
                  <TableCell className="text-left">
                    <Badge variant={info.variant} className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase shadow-sm">
                      {info.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground text-left">
                    {formatRelativeTime(property.last_verified)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-xs uppercase tracking-widest text-muted-foreground">Actions</DropdownMenuLabel>
                        <DropdownMenuItem 
                          className="text-green-600 font-bold focus:bg-green-50 focus:text-green-700 cursor-pointer"
                          onClick={() => handleVerify(property.id)}
                          disabled={loadingId === property.id}
                        >
                          {loadingId === property.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <ShieldCheck className="mr-2 h-4 w-4" />
                          )}
                          Verify Available
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("Opening details...")}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("Audit log requested...")}>
                          <History className="mr-2 h-4 w-4" />
                          Audit Trail
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                          onClick={() => handleDelete(property.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Listing
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No properties found matching your search.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
