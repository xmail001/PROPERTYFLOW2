import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Property, VerificationLog, PropertyStatus } from './types'
import { MOCK_PROPERTIES, MOCK_VERIFICATION_LOGS } from './mock-data'

interface AppSettings {
  userName: string
  userEmail: string
  agencyName: string
  brokerLicense: string
  operatingRegion: string
  requireOwnerConfirmation: boolean
  autoFlagStaleListings: boolean
  verificationThreshold: string
  pushNotifications: boolean
  emailSummaries: boolean
}

interface AppState {
  properties: Property[]
  verificationLogs: VerificationLog[]
  settings: AppSettings
  
  // Actions
  addProperty: (property: Property) => void
  verifyProperty: (id: string, agentName: string, notes: string) => void
  updateSettings: (newSettings: Partial<AppSettings>) => void
  deleteProperty: (id: string) => void
  runComplianceCheck: () => { flaggedCount: number }
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      properties: MOCK_PROPERTIES,
      verificationLogs: MOCK_VERIFICATION_LOGS,
      settings: {
        userName: "Ismail Bourhim",
        userEmail: "ismail@propertyflow.com",
        agencyName: "Elite Riyadh Realty",
        brokerLicense: "KSA-RE-99201",
        operatingRegion: "riyadh",
        requireOwnerConfirmation: true,
        autoFlagStaleListings: true,
        verificationThreshold: "48h",
        pushNotifications: true,
        emailSummaries: false,
      },

      addProperty: (property) => 
        set((state) => ({ 
          properties: [property, ...state.properties] 
        })),

      verifyProperty: (id, agentName, notes) => {
        const timestamp = new Date().toISOString()
        const property = get().properties.find(p => p.id === id)
        
        if (!property) return

        const newLog: VerificationLog = {
          id: `l-${Math.random().toString(36).substring(7)}`,
          property_id: id,
          property_name: property.name,
          agent_id: 'current-user',
          agent_name: agentName,
          status_at_time: 'available',
          notes: notes,
          created_at: timestamp,
        }

        set((state) => ({
          properties: state.properties.map((p) => 
            p.id === id ? { ...p, status: 'available', last_verified_at: timestamp, agent_confirmed: true } : p
          ),
          verificationLogs: [newLog, ...state.verificationLogs]
        }))
      },

      deleteProperty: (id) => 
        set((state) => ({
          properties: state.properties.filter(p => p.id !== id)
        })),

      updateSettings: (newSettings) => 
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),

      runComplianceCheck: () => {
        const { properties, settings } = get()
        const now = new Date()
        const thresholdHours = settings.verificationThreshold === '24h' ? 24 : settings.verificationThreshold === '48h' ? 48 : 168
        
        let flaggedCount = 0
        const updatedProperties = properties.map(p => {
          const diffHours = (now.getTime() - new Date(p.last_verified_at).getTime()) / (1000 * 60 * 60)
          if (p.status !== 'verification_required' && diffHours > thresholdHours) {
            flaggedCount++
            return { ...p, status: 'verification_required' as PropertyStatus }
          }
          return p
        })

        if (flaggedCount > 0) {
          set({ properties: updatedProperties })
        }

        return { flaggedCount }
      },
    }),
    {
      name: 'propertyflow-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
