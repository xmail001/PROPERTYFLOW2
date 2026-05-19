"use client"

import { useState, useEffect } from "react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { PropertyTable } from "@/components/dashboard/property-table"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { UrgentVerifications } from "@/components/dashboard/urgent-verifications"
import { AddPropertyModal } from "@/components/dashboard/add-property-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileCheck, Download, Filter, Zap, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useStore } from "@/lib/store"
import { formatRelativeTime, downloadCSV } from "@/lib/utils"

export function DashboardContent() {
  const [search, setSearch] = useState("")
  const { verificationLogs, properties, runComplianceCheck } = useStore()

  const handleExport = () => {
    downloadCSV(properties, "propertyflow-inventory")
    toast.success("Inventory exported", { description: "Your CSV file is ready." })
  }

  const handleComplianceCheck = () => {
    const { flaggedCount } = runComplianceCheck()
    if (flaggedCount > 0) {
      toast.warning("Compliance check completed", {
        description: `${flaggedCount} stale listings have been flagged for verification.`,
      })
    } else {
      toast.success("Compliance check completed", {
        description: "All listings are within the verification threshold.",
      })
    }
  }

  const handleAction = (action: string) => {
    toast.info(`${action} requested`, {
      description: "This feature is being prepared for the next system update.",
    })
  }

  // Get the latest 4 activities
  const recentActivities = verificationLogs.slice(0, 4).map(log => ({
    name: log.property_name,
    action: `Status: ${log.status_at_time}`,
    time: formatRelativeTime(log.created_at),
    color: log.status_at_time === 'available' ? 'bg-green-500' : 'bg-blue-500',
    agent: log.agent_name,
    avatar: log.agent_name.charAt(0)
  }))

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Verification Dashboard</h1>
          <p className="text-muted-foreground">
            Manage real-time property availability and verification statuses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <AddPropertyModal />
        </div>
      </div>

      <StatsCards />

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-card border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="needs_verification">Needs Verification</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search properties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => handleAction("Filters")}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-7">
            <Card className="lg:col-span-4 border-none shadow-md bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Verification Trends</CardTitle>
                    <CardDescription>Daily property verification activity.</CardDescription>
                  </div>
                  <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-none">
                    <Zap className="mr-1 h-3 w-3 fill-current" />
                    +12% vs last week
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <OverviewChart />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-none shadow-md">
              <CardHeader>
                <CardTitle>Team Activity</CardTitle>
                <CardDescription>Latest updates from your agent network.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                          <AvatarFallback className="text-[10px] bg-muted">{activity.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold leading-none">{activity.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {activity.action} by <span className="text-foreground font-medium">{activity.agent}</span>
                          </p>
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">{activity.time}</div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-sm text-muted-foreground italic border-2 border-dashed rounded-lg">
                      No recent activity recorded.
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="mt-8 w-full text-xs font-bold uppercase tracking-widest shadow-sm" 
                  size="sm"
                  onClick={() => handleAction("Full Audit Log view")}
                >
                  View Full Audit Log
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Verified Property Table</CardTitle>
                <CardDescription>Inventory with real-time availability status.</CardDescription>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                className="font-bold text-xs uppercase tracking-wider"
                onClick={handleComplianceCheck}
              >
                <FileCheck className="mr-2 h-3.5 w-3.5" />
                Run Compliance Check
              </Button>
            </CardHeader>
            <CardContent>
              <PropertyTable search={search} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="needs_verification" className="space-y-4">
          <UrgentVerifications />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsCharts />
        </TabsContent>
      </Tabs>
    </div>
  )
}
