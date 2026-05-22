"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Building, ShieldCheck, Bell, Save, ShieldAlert, RotateCcw, Zap, Send } from "lucide-react"
import { toast } from "sonner"
import { useStore } from "@/lib/store"
import { getInitials } from "@/lib/utils"
import { triggerAutomation } from "@/lib/api"

export function SettingsContent() {
  const { settings, updateSettings, syncData } = useStore()

  const handleSave = (section: string) => {
    toast.success(`${section} updated successfully`, {
      description: `Your ${section.toLowerCase()} changes have been synchronized.`,
    })
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    updateSettings({ [field]: value })
  }

  const handleTestWebhook = async () => {
    if (!settings.n8nWebhookUrl) {
      toast.error("No Webhook URL", {
        description: "Please enter an n8n webhook URL first.",
      })
      return
    }

    const promise = triggerAutomation(settings.n8nWebhookUrl, 'test_connection', {
      message: "Hello from PropertyFlow!",
      test_data: {
        property_id: "test-123",
        status: "available",
        timestamp: new Date().toISOString()
      },
      agent: settings.userName
    })

    toast.promise(promise, {
      loading: 'Sending test payload to n8n...',
      success: 'Webhook received successfully!',
      error: 'Failed to connect to n8n. Check your URL.',
    })
  }

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, agency preferences, and verification compliance rules.
        </p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col lg:flex-row gap-6">
        <TabsList className="flex lg:flex-col h-auto bg-transparent border-none space-y-1 lg:w-64 justify-start p-0">
          <TabsTrigger value="profile" className="justify-start gap-2 w-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <User className="h-4 w-4" />
            My Profile
          </TabsTrigger>
          <TabsTrigger value="agency" className="justify-start gap-2 w-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Building className="h-4 w-4" />
            Agency Details
          </TabsTrigger>
          <TabsTrigger value="compliance" className="justify-start gap-2 w-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <ShieldCheck className="h-4 w-4" />
            Verification Rules
          </TabsTrigger>
          <TabsTrigger value="automation" className="justify-start gap-2 w-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Zap className="h-4 w-4" />
            n8n Automation
          </TabsTrigger>
          <TabsTrigger value="notifications" className="justify-start gap-2 w-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="justify-start gap-2 w-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <RotateCcw className="h-4 w-4" />
            System Fix
          </TabsTrigger>
        </TabsList>

        <div className="flex-1">
          <TabsContent value="profile">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your profile and account settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>{getInitials(settings.userName)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" onClick={() => toast.info("Avatar update coming soon")}>Change Avatar</Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={settings.userName} 
                      onChange={(e) => handleInputChange("userName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      value={settings.userEmail} 
                      onChange={(e) => handleInputChange("userEmail", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-4">
                <Button className="ml-auto" onClick={() => handleSave("Profile")}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="agency">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Agency Profile</CardTitle>
                <CardDescription>Public information for your real estate agency.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="agency-name">Agency Legal Name</Label>
                  <Input 
                    id="agency-name" 
                    value={settings.agencyName} 
                    onChange={(e) => handleInputChange("agencyName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">Broker License Number</Label>
                  <Input 
                    id="license" 
                    value={settings.brokerLicense} 
                    onChange={(e) => handleInputChange("brokerLicense", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Primary Operating Region</Label>
                  <Select 
                    value={settings.operatingRegion} 
                    onValueChange={(val) => handleInputChange("operatingRegion", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="riyadh">Riyadh Region</SelectItem>
                      <SelectItem value="makkah">Makkah / Jeddah</SelectItem>
                      <SelectItem value="eastern">Eastern Province</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-4">
                <Button className="ml-auto" onClick={() => handleSave("Agency info")}>Save Agency Info</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  <CardTitle>Compliance & Verification Rules</CardTitle>
                </div>
                <CardDescription>Configure how PropertyFlow enforces listing accuracy.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Require Owner Confirmation</Label>
                    <p className="text-sm text-muted-foreground">
                      Properties cannot be marked &quot;Available&quot; without owner approval.
                    </p>
                  </div>
                  <Switch 
                    checked={settings.requireOwnerConfirmation} 
                    onCheckedChange={(val) => handleInputChange("requireOwnerConfirmation", val)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-Flag Stale Listings</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically request audit for listings unverified for 48 hours.
                    </p>
                  </div>
                  <Switch 
                    checked={settings.autoFlagStaleListings} 
                    onCheckedChange={(val) => handleInputChange("autoFlagStaleListings", val)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Default Verification Threshold</Label>
                  <Select 
                    value={settings.verificationThreshold} 
                    onValueChange={(val) => handleInputChange("verificationThreshold", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select threshold" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Every 24 Hours</SelectItem>
                      <SelectItem value="48h">Every 48 Hours</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-4">
                <Button className="ml-auto" onClick={() => handleSave("Compliance rules")}>Update Rules</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="automation">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle>n8n Automation Settings</CardTitle>
                </div>
                <CardDescription>Connect your dashboard to external n8n workflows for autonomous operations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">n8n Webhook URL</Label>
                  <Input 
                    id="webhook-url" 
                    placeholder="https://n8n.your-agency.com/webhook/..." 
                    value={settings.n8nWebhookUrl}
                    onChange={(e) => handleInputChange("n8nWebhookUrl", e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    This URL will receive a POST request whenever an automated trigger is fired.
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Trigger on Status Change</Label>
                    <p className="text-sm text-muted-foreground">
                      Send data to n8n when a property moves to Available, Reserved, or Sold.
                    </p>
                  </div>
                  <Switch 
                    checked={settings.triggerOnStatusChange} 
                    onCheckedChange={(val) => handleInputChange("triggerOnStatusChange", val)}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-4 flex justify-between">
                <Button variant="outline" onClick={handleTestWebhook}>
                  <Send className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
                <Button onClick={() => handleSave("Automation settings")}>Connect n8n</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Alert Preferences</CardTitle>
                <CardDescription>Manage how you receive verification alerts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="push">Push Notifications</Label>
                  <Switch 
                    id="push" 
                    checked={settings.pushNotifications} 
                    onCheckedChange={(val) => handleInputChange("pushNotifications", val)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-alerts">Email Summaries</Label>
                  <Switch 
                    id="email-alerts" 
                    checked={settings.emailSummaries} 
                    onCheckedChange={(val) => handleInputChange("emailSummaries", val)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diagnostics">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>System Diagnostics</CardTitle>
                <CardDescription>Tools to resolve sync issues or clear browser cache.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-left">
                <div className="flex items-center justify-between rounded-lg border p-4 bg-amber-50/50 dark:bg-amber-950/10">
                  <div className="space-y-0.5">
                    <Label className="text-base">Force Cloud Sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Overwrites local data with the latest from Supabase.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    syncData()
                    toast.success("Cloud synchronization started")
                  }}>
                    Sync Now
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4 bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/20">
                  <div className="space-y-0.5">
                    <Label className="text-base text-red-600 font-bold">Hard Reset</Label>
                    <p className="text-sm text-muted-foreground">
                      Clears all browser memory. Use if the dashboard feels broken.
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => {
                    if (confirm("This will clear all browser settings. Are you sure?")) {
                      localStorage.clear()
                      window.location.reload()
                    }
                  }}>
                    Clear & Reload
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
