"use client"

import { LayoutDashboard, Building2, ClipboardCheck, Settings, Bell, Search, LogOut } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SupabaseStatus } from "@/components/dashboard/supabase-status"
import { signOut } from "@/lib/auth"
import { toast } from "sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch {
      // For mock mode, just redirect
      window.location.href = "/login"
    }
  }

  const handleGlobalSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      toast.info("Global Search initiated", {
        description: `Searching for "${e.currentTarget.value}" across all modules...`,
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card lg:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-xl tracking-tight font-extrabold">PropertyFlow</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/properties"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <Building2 className="h-4 w-4" />
            Inventory
          </Link>
          <Link
            href="/dashboard/verifications"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <ClipboardCheck className="h-4 w-4" />
            Audit Logs
          </Link>
          <div className="pt-4">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
              System
            </p>
            <div className="mt-2 space-y-1">
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <button 
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
            <Avatar className="h-8 w-8 border">
              <AvatarFallback className="text-[10px] bg-primary text-primary-foreground font-bold">IB</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden text-left">
              <span className="truncate text-xs font-bold text-foreground leading-tight">Ismail Bourhim</span>
              <span className="truncate text-[10px] text-muted-foreground font-medium">Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-8">
          <div className="flex items-center gap-4">
            <div className="relative hidden xl:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search inventory, agents, or cities..."
                onKeyDown={handleGlobalSearch}
                className="h-10 w-[400px] rounded-full border border-input bg-muted/50 pl-10 pr-4 text-sm transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SupabaseStatus />
            <div className="hidden items-center gap-1 rounded-full border bg-muted/30 p-1 md:flex">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500 ml-2"></div>
              <span className="px-2 text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Live Feed Active</span>
            </div>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-muted-foreground"
              onClick={() => toast.info("No new notifications", { description: "You're all caught up!" })}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-card"></span>
            </Button>
            <Avatar className="h-9 w-9 border-2 border-primary/10 shadow-sm">
              <AvatarFallback className="text-[10px] font-bold">IB</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/10 p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
