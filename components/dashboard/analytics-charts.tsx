"use client"

import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  PieChart,
  Pie
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { useStore } from "@/lib/store"

export function AnalyticsCharts() {
  const properties = useStore((state) => state.properties)

  // Dynamic status data
  const statusCounts = properties.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const statusData = [
    { name: "Available", total: statusCounts['available'] || 0, color: "#10b981" },
    { name: "Reserved", total: statusCounts['reserved'] || 0, color: "#f59e0b" },
    { name: "Sold", total: statusCounts['sold'] || 0, color: "#ef4444" },
    { name: "Negotiation", total: statusCounts['under_negotiation'] || 0, color: "#3b82f6" },
    { name: "Pending", total: statusCounts['verification_required'] || 0, color: "#6b7280" },
  ]

  // Dynamic city data
  const cityCounts = properties.reduce((acc, p) => {
    acc[p.location] = (acc[p.location] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const cityData = Object.entries(cityCounts).map(([name, value], index) => ({
    name,
    value,
    color: ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#10b981"][index % 5]
  }))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
          <CardDescription>Number of properties by current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--foreground))"
                }}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Regional Distribution</CardTitle>
          <CardDescription>Visual mapping of inventory by city.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="relative w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                >
                  {cityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    color: "hsl(var(--foreground))"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-foreground">{properties.length}</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total Units</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            {cityData.map((city) => (
              <div key={city.name} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: city.color }} />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold">{city.name}</span>
                  <span className="text-[10px] text-muted-foreground">{city.value} units</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
