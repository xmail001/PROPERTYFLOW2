import { Property, VerificationLog } from './types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Palm Villa',
    location: 'Riyadh',
    status: 'available',
    last_verified: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2h ago
    owner_confirmed: true,
    agent_confirmed: true,
    price: 4500000,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Marina Tower',
    location: 'Jeddah',
    status: 'reserved',
    last_verified: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1d ago
    owner_confirmed: true,
    agent_confirmed: true,
    price: 2800000,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Elite Residence',
    location: 'Riyadh',
    status: 'sold',
    last_verified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3d ago
    owner_confirmed: true,
    agent_confirmed: true,
    price: 6200000,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Skyline Apartment',
    location: 'Khobar',
    status: 'under_negotiation',
    last_verified: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
    owner_confirmed: true,
    agent_confirmed: true,
    price: 1500000,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Desert Rose Estate',
    location: 'Riyadh',
    status: 'verification_required',
    last_verified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7d ago
    owner_confirmed: false,
    agent_confirmed: true,
    price: 8900000,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Business Bay Loft',
    location: 'Jeddah',
    status: 'inactive',
    last_verified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14d ago
    owner_confirmed: false,
    agent_confirmed: false,
    price: 950000,
    created_at: new Date().toISOString(),
  }
];

export const MOCK_STATS = {
  verified_available: 124,
  pending_verifications: 18,
  recently_updated: 45,
  active_deals: 32
};

export const MOCK_VERIFICATION_LOGS: VerificationLog[] = [
  {
    id: 'l1',
    property_id: '1',
    property_name: 'Palm Villa',
    agent_id: 'a1',
    agent_name: 'Sarah J.',
    status_at_time: 'available',
    notes: 'Verified via on-site visit and owner call.',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'l2',
    property_id: '2',
    property_name: 'Marina Tower',
    agent_id: 'a2',
    agent_name: 'Mike R.',
    status_at_time: 'reserved',
    notes: 'Buyer deposit received, status updated to Reserved.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'l3',
    property_id: '3',
    property_name: 'Elite Residence',
    agent_id: 'a3',
    agent_name: 'Alex K.',
    status_at_time: 'sold',
    notes: 'Final contract signed, transaction complete.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'l4',
    property_id: '4',
    property_name: 'Skyline Apartment',
    agent_id: 'a1',
    agent_name: 'Sarah J.',
    status_at_time: 'under_negotiation',
    notes: 'Offer received, owner considering terms.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'l5',
    property_id: '1',
    property_name: 'Palm Villa',
    agent_id: 'system',
    agent_name: 'System Audit',
    status_at_time: 'verification_required',
    notes: 'Periodic verification threshold exceeded.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  }
];
