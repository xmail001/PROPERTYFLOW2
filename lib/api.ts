import { supabase } from './supabase'
import { Property, PropertyStatus } from './types'

/**
 * SQL SCHEMA FOR SUPABASE (Run this in the Supabase SQL Editor):
 * 
 * -- 1. Create Property Status Enum
 * CREATE TYPE property_status AS ENUM (
 *   'available', 
 *   'reserved', 
 *   'under_negotiation', 
 *   'sold', 
 *   'inactive', 
 *   'verification_required'
 * );
 * 
 * -- 2. Create Properties Table
 * CREATE TABLE properties (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   name TEXT NOT NULL,
 *   city TEXT NOT NULL,
 *   status property_status DEFAULT 'verification_required',
 *   last_verified_at TIMESTAMPTZ DEFAULT NOW(),
 *   owner_confirmed BOOLEAN DEFAULT FALSE,
 *   agent_confirmed BOOLEAN DEFAULT FALSE,
 *   price NUMERIC,
 *   image_url TEXT,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- 3. Create Verification Logs Table
 * CREATE TABLE verification_logs (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
 *   agent_name TEXT,
 *   status_at_time property_status,
 *   notes TEXT,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */

export async function getProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('last_verified_at', { ascending: false })

  if (error) throw error
  return data as Property[]
}

export async function verifyProperty(propertyId: string, status: PropertyStatus = 'available') {
  const { data, error } = await supabase
    .from('properties')
    .update({ 
      last_verified_at: new Date().toISOString(),
      status: status,
      agent_confirmed: true 
    })
    .eq('id', propertyId)
    .select()

  if (error) throw error

  // Log the verification
  await supabase.from('verification_logs').insert({
    property_id: propertyId,
    status_at_time: status,
    agent_name: 'Ismail Bourhim' // Hardcoded for now
  })

  return data[0]
}
