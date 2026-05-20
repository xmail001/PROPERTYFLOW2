"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

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
      <LineChart data={data}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke="hsl(var(--muted-foreground))" 
          opacity={0.1} 
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
            backgroundColor: "hsl(var(--card))", 
            borderColor: "hsl(var(--border))",
            borderRadius: "var(--radius)",
            color: "hsl(var(--foreground))",
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
          }}
          itemStyle={{ color: "hsl(var(--primary))", fontWeight: "bold" }}
          cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1 }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          dot={{ fill: "hsl(var(--card))", stroke: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--card))", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
