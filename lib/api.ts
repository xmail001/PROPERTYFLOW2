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

  const { data, error } = await supabase
    .from('properties')
    .insert([property])
    .select()

  if (error) throw error
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
      last_verified_at: timestamp,
      agent_confirmed: true 
    })
    .eq('id', id)

  if (propError) throw propError

  // 2. Fetch property name for the log
  const { data: propData } = await supabase
    .from('properties')
    .select('name')
    .eq('id', id)
    .single()

  // 3. Create log
  const { error: logError } = await supabase
    .from('verification_logs')
    .insert([{
      property_id: id,
      property_name: propData?.name || 'Unknown',
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
