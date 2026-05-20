import { supabase, isSupabaseConfigured } from './supabase'
import { Property, PropertyStatus, VerificationLog } from './types'

export async function fetchProperties() {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching properties:', error)
    return null
  }
  return data as Property[]
}

export async function fetchVerificationLogs() {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('verification_logs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching logs:', error)
    return null
  }
  return data as VerificationLog[]
}

export async function createProperty(property: Omit<Property, 'id' | 'created_at'>) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  // We only send columns that exist in the user's provided schema
  const dbData = {
    title: property.title,
    location: property.location,
    price: property.price,
    status: property.status,
    last_verified: property.last_verified,
    // Add these only if you ran the SQL to add them!
    owner_confirmed: property.owner_confirmed,
    agent_confirmed: property.agent_confirmed
  }

  const { data, error } = await supabase
    .from('properties')
    .insert([dbData])
    .select()

  if (error) {
    console.error('Supabase Insert Error:', error)
    throw error
  }
  return data[0] as Property
}

export async function updatePropertyStatus(id: string, status: PropertyStatus, agentName: string, notes: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const timestamp = new Date().toISOString()
  
  // 1. Update property
  const { error: propError } = await supabase
    .from('properties')
    .update({ 
      status, 
      last_verified: timestamp,
      agent_confirmed: true 
    })
    .eq('id', id)

  if (propError) throw propError

  // 2. Fetch property title for the log
  const { data: propData } = await supabase
    .from('properties')
    .select('title')
    .eq('id', id)
    .single()

  // 3. Create log
  const { error: logError } = await supabase
    .from('verification_logs')
    .insert([{
      property_id: id,
      property_name: propData?.title || 'Unknown',
      agent_name: agentName,
      status_at_time: status,
      notes,
      created_at: timestamp
    }])

  if (logError) throw logError
}

export async function deletePropertyFromDb(id: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function triggerAutomation(webhookUrl: string, event: string, data: any) {
  if (!webhookUrl) return

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      payload: data
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to trigger n8n workflow')
  }

  return response.json()
}
