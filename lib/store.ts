import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Property, VerificationLog, PropertyStatus } from './types'
import { MOCK_PROPERTIES, MOCK_VERIFICATION_LOGS } from './mock-data'
import { 
  fetchProperties, 
  fetchVerificationLogs, 
  createProperty, 
  updatePropertyStatus, 
  deletePropertyFromDb 
} from './api'
import { toast } from 'sonner'

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
  isLoading: boolean
  
  // Actions
  syncData: () => Promise<void>
  addProperty: (property: Omit<Property, 'id' | 'created_at'>) => Promise<void>
  verifyProperty: (id: string, agentName: string, notes: string) => Promise<void>
  updateSettings: (newSettings: Partial<AppSettings>) => void
  deleteProperty: (id: string) => Promise<void>
  runComplianceCheck: () => { flaggedCount: number }
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      properties: MOCK_PROPERTIES,
      verificationLogs: MOCK_VERIFICATION_LOGS,
      isLoading: false,
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

      syncData: async () => {
        set({ isLoading: true })
        try {
          const props = await fetchProperties()
          const logs = await fetchVerificationLogs()
          
          if (props && props.length > 0) {
            set({ properties: props })
          }
          if (logs && logs.length > 0) {
            set({ verificationLogs: logs })
          }
        } catch (error) {
          console.error("Sync failed:", error)
        } finally {
          set({ isLoading: false })
        }
      },

      addProperty: async (propertyData) => {
        try {
          const newProp = await createProperty(propertyData)
          set((state) => ({ 
            properties: [newProp, ...state.properties] 
          }))
          toast.success("Property saved to Supabase")
        } catch (error: any) {
          console.error("Failed to add property to Supabase:", error)
          toast.error("Supabase Sync Failed", {
            description: "Property saved locally, but not to database. Ensure RLS policies allow inserts."
          })
          
          const localProp: Property = {
            ...propertyData,
            id: `L-${Math.random().toString(36).substring(7)}`,
            created_at: new Date().toISOString()
          }
          set((state) => ({ properties: [localProp, ...state.properties] }))
        }
      },

      verifyProperty: async (id, agentName, notes) => {
        try {
          await updatePropertyStatus(id, 'available', agentName, notes)
          await get().syncData()
        } catch (error) {
          console.error("Failed to verify property:", error)
          // Local fallback
          set((state) => ({
            properties: state.properties.map((p) => 
              p.id === id ? { ...p, status: 'available', last_verified: new Date().toISOString(), agent_confirmed: true } : p
            )
          }))
        }
      },

      deleteProperty: async (id) => {
        try {
          await deletePropertyFromDb(id)
          set((state) => ({
            properties: state.properties.filter(p => p.id !== id)
          }))
        } catch (error) {
          console.error("Failed to delete property:", error)
          set((state) => ({
            properties: state.properties.filter(p => p.id !== id)
          }))
        }
      },

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
          const diffHours = (now.getTime() - new Date(p.last_verified).getTime()) / (1000 * 60 * 60)
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
      // Safe storage factory to prevent crashes during SSR
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        // Fallback for server-side rendering
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
    }
  )
)
