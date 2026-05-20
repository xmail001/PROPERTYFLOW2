"use client"

import * as React from "react"
import { Database, ShieldCheck, Code, Copy, Check, RotateCcw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { isSupabaseConfigured } from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SupabaseStatus() {
  const { isLive, syncData, isLoading } = useStore()
  const [copied, setCopied] = React.useState(false)

  const isConnected = isLive && isSupabaseConfigured

  const sqlSchema = `-- Run this in your Supabase SQL Editor:

CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_code text,
  title text NOT NULL,
  price numeric,
  location text,
  type text,
  status text DEFAULT 'Available',
  assigned_agent text,
  last_verified timestamp DEFAULT now(),
  owner_confirmed boolean DEFAULT false,
  agent_confirmed boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

CREATE TABLE public.verification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  property_name text,
  agent_name text,
  status_at_time text,
  notes text,
  created_at timestamp DEFAULT now()
);`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchema)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1 rounded-full border bg-muted/30 hover:bg-muted/50 transition-colors">
          {isConnected ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">Live Sync Active</span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Syncing / Mock Mode</span>
            </>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between w-full pr-8">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <DialogTitle>Database Connection</DialogTitle>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => syncData()}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4 mr-2" />}
              Refresh Sync
            </Button>
          </div>
          <DialogDescription>
            {isConnected 
              ? "Your application is successfully connected to Supabase. Real-time verification data is active." 
              : "PropertyFlow is currently running in Mock Mode. Follow these steps to connect your live Supabase instance."
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="schema" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schema">1. SQL Schema</TabsTrigger>
            <TabsTrigger value="env">2. Environment Variables</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schema" className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Execute this script in your Supabase SQL Editor to initialize the required tables.
            </p>
            <div className="relative">
              <pre className="p-4 rounded-lg bg-muted font-mono text-xs overflow-x-auto max-h-[300px]">
                {sqlSchema}
              </pre>
              <Button 
                size="sm" 
                variant="outline" 
                className="absolute top-2 right-2 h-8" 
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="env" className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Add these variables to your <code>.env.local</code> file in the project root.
            </p>
            <div className="p-4 rounded-lg bg-muted font-mono text-xs space-y-2 border">
              <p>NEXT_PUBLIC_SUPABASE_URL=your_project_url</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</p>
            </div>
            <div className="p-4 rounded-md bg-amber-50 border border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/20">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
                <Code className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Developer Note</span>
              </div>
              <p className="text-xs mt-1 text-amber-700 dark:text-amber-500">
                After setting variables, restart your dev server (<code>npm run dev</code>) to apply changes.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
