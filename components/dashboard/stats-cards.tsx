import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, Activity, TrendingUp } from "lucide-react"
import { useStore } from "@/lib/store"

export function StatsCards() {
  const properties = useStore((state) => state.properties)
  
  const verifiedAvailable = properties.filter(p => p.status === 'available').length
  const pendingVerifications = properties.filter(p => p.status === 'verification_required').length
  const activeDeals = properties.filter(p => p.status === 'reserved' || p.status === 'under_negotiation').length
  
  const now = new Date()
  const last24h = properties.filter(p => 
    (now.getTime() - new Date(p.last_verified).getTime()) < 1000 * 60 * 60 * 24
  ).length

  const inventoryHealth = properties.length > 0 
    ? Math.round((verifiedAvailable / properties.length) * 100) 
    : 0

  const stats = [
    {
      title: "Verified Available",
      value: verifiedAvailable,
      description: "Ready for transaction",
      icon: CheckCircle2,
      color: "text-green-600",
      health: inventoryHealth,
    },
    {
      title: "Pending Verifications",
      value: pendingVerifications,
      description: "Requires agent confirmation",
      icon: Clock,
      color: "text-red-500",
    },
    {
      title: "Recently Updated",
      value: last24h,
      description: "Last 24 hours",
      icon: Activity,
      color: "text-blue-600",
    },
    {
      title: "Active Deals",
      value: activeDeals,
      description: "In negotiation pipeline",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mb-4">
              {stat.description}
            </p>
            {stat.health !== undefined && (
              <div className="mt-2 space-y-2">
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${stat.health}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                  <span>Inventory Health</span>
                  <span>{stat.health}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
