"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts"

const data = [
  { name: "Mon", total: 12 },
  { name: "Tue", total: 18 },
  { name: "Wed", total: 15 },
  { name: "Thu", total: 25 },
  { name: "Fri", total: 32 },
  { name: "Sat", total: 28 },
  { name: "Sun", total: 35 },
]

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke="hsl(var(--muted-foreground))" 
          opacity={0.2} 
        />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "hsl(var(--background))", 
            borderColor: "hsl(var(--border))",
            borderRadius: "var(--radius)",
            color: "hsl(var(--foreground))",
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.5)",
            border: "1px solid hsl(var(--border))"
          }}
          itemStyle={{ color: "hsl(var(--primary))", fontWeight: "bold" }}
          cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorTotal)"
          dot={{ fill: "hsl(var(--background))", stroke: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
