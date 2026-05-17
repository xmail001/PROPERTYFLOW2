import { supabase } from "@/lib/supabaseClient";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const { data, error } = await supabase.from("properties").select("*");

  return (
    <div className="w-full">
      {/* 
        This is the data fetch you requested in STEP 3!
        (We kept your original dashboard UI intact below it so you don't lose your work)
      */}
      <div className="mb-8 border-b pb-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <pre className="bg-muted text-muted-foreground p-4 rounded-md text-xs overflow-auto max-h-[300px] shadow-inner">
          {error ? JSON.stringify(error, null, 2) : JSON.stringify(data, null, 2)}
        </pre>
      </div>

      <DashboardClient />
    </div>
  );
}
