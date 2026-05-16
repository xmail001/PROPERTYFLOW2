export type PropertyStatus = 
  | 'available' 
  | 'reserved' 
  | 'under_negotiation' 
  | 'sold' 
  | 'inactive' 
  | 'verification_required';

export interface Property {
  id: string;
  name: string;
  city: string;
  status: PropertyStatus;
  last_verified_at: string; // ISO string
  owner_confirmed: boolean;
  agent_confirmed: boolean;
  price?: number;
  image_url?: string;
  created_at: string;
}

export interface VerificationLog {
  id: string;
  property_id: string;
  property_name: string;
  agent_id: string;
  agent_name: string;
  status_at_time: PropertyStatus;
  notes?: string;
  created_at: string;
}

export interface DashboardStats {
  verified_available: number;
  pending_verifications: number;
  recently_updated: number;
  active_deals: number;
}
