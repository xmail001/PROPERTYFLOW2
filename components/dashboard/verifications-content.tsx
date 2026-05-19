"use client"

import { useState } from "react"
import { formatRelativeTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyStatus } from "@/lib/types"
import { toast } from "sonner"
import { useStore } from "@/lib/store"

const statusConfig: Record<PropertyStatus, { label: string; variant: "success" | "warning" | "error" | "secondary" | "info" | "default" }> = {
  available: { label: "Available", variant: "success" },
  reserved: { label: "Reserved", variant: "warning" },
  under_negotiation: { label: "Negotiation", variant: "info" },
  sold: { label: "Sold", variant: "error" },
  inactive: { label: "Inactive", variant: "secondary" },
  verification_required: { label: "Verification Required", variant: "error" },
}

export function VerificationsContent() {
  const [search, setSearch] = useState("")
  const verificationLogs = useStore((state) => state.verificationLogs)

  const getStatusConfig = (status: string) => {
    const normalized = (status || "").toLowerCase() as PropertyStatus
    return statusConfig[normalized] || { label: status || "Unknown", variant: "default" }
  }

  const handleAction = (action: string) => {
    toast.info(`${action} requested`, {
      description: "Generating secure report...",
    })
  }

  const filteredLogs = verificationLogs.filter(log => 
    log.property_name.toLowerCase().includes(search.toLowerCase()) ||
    log.agent_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit & Verifications</h1>
          <p className="text-muted-foreground">
            A complete history of all property status changes and agent audits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAction("PDF Audit Report")}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF Report
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>System Audit Ledger</CardTitle>
              <CardDescription>Immutable record of property transaction-readiness.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Filter by agent or property..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleAction("Audit Filters")}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Status Result</TableHead>
                <TableHead>Verification Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const config = getStatusConfig(log.status_at_time)
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{new Date(log.created_at).toLocaleDateString()}</span>
                          <span>{formatRelativeTime(log.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{log.property_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold">
                            {log.agent_name.charAt(0)}
                          </div>
                          <span className="text-sm">{log.agent_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.variant as "default" | "success" | "warning" | "error" | "secondary" | "info" | null | undefined} className="text-[10px] uppercase font-bold">
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground italic max-w-xs truncate">
                        &quot;{log.notes}&quot;
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No verification records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
