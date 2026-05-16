"use client"

import { useState } from "react"
import { PropertyTable } from "@/components/dashboard/property-table"
import { AddPropertyModal } from "@/components/dashboard/add-property-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter, Download } from "lucide-react"
import { toast } from "sonner"
import { useStore } from "@/lib/store"
import { downloadCSV } from "@/lib/utils"

export default function PropertiesPage() {
  const [search, setSearch] = useState("")
  const properties = useStore((state) => state.properties)

  const handleExport = () => {
    downloadCSV(properties, "propertyflow-inventory-full")
    toast.success("Inventory exported")
  }

  const handleAction = (action: string) => {
    toast.info(`${action} requested`, {
      description: "Processing your request...",
    })
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Inventory</h1>
          <p className="text-muted-foreground">
            Manage your full portfolio of listings and their live transaction status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <AddPropertyModal />
        </div>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Global Inventory</CardTitle>
              <CardDescription>Live database of all managed listings.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search inventory..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => handleAction("Advanced Filters")}>
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PropertyTable search={search} />
        </CardContent>
      </Card>
    </div>
  )
}
