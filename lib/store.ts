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
import { isSupabaseConfigured } from './supabase'
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
  n8nWebhookUrl: string
  triggerOnStatusChange: boolean
}

interface AppState {
  properties: Property[]
  verificationLogs: VerificationLog[]
  settings: AppSettings
  isLoading: boolean
  isLive: boolean
  
  // Actions
  syncData: () => Promise<void>
  addProperty: (property: Omit<Property, 'id' | 'created_at'>) => Promise<void>
  verifyProperty: (id: string, agentName: string, notes: string) => Promise<void>
  updateSettings: (newSettings: Partial<AppSettings>) => void
  deleteProperty: (id: string) => Promise<void>
  runComplianceCheck: () => { flaggedCount: number }
  clearMockData: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      properties: MOCK_PROPERTIES,
      verificationLogs: MOCK_VERIFICATION_LOGS,
      isLoading: false,
      isLive: false,
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
        n8nWebhookUrl: "https://galvanotactic-sharilyn-childing.ngrok-free.dev/webhook-test/property-intake",
        triggerOnStatusChange: true,
      },

      syncData: async () => {
        if (!isSupabaseConfigured) return
        
        set({ isLoading: true })
        try {
          const props = await fetchProperties()
          const logs = await fetchVerificationLogs()
          
          set({ 
            properties: props || [], 
            verificationLogs: logs || [],
            isLive: true 
          })
        } catch (error) {
          console.error("Sync failed:", error)
          set({ isLive: false })
        } finally {
          set({ isLoading: false })
        }
      },

      clearMockData: () => {
        set({ properties: [], verificationLogs: [] })
        toast.success("Dashboard cleared")
      },

      addProperty: async (propertyData) => {
        const { settings } = get()
        try {
          const newProp = await createProperty(propertyData)
          set((state) => ({ 
            properties: [newProp, ...state.properties] 
          }))
          toast.success("Saved to Cloud Database")

          // Trigger n8n webhook automatically
          if (settings.n8nWebhookUrl) {
            triggerAutomation(settings.n8nWebhookUrl, 'property_created', {
              property: newProp,
              agent: settings.userName
            }).catch(err => console.error("Auto-webhook failed:", err))
          }
        } catch (error: unknown) {
          const err = error as { message?: string }
          console.error("Failed to add property:", error)
          
          if (!get().isLive) {
            const localProp: Property = {
              ...propertyData,
              id: `L-${Math.random().toString(36).substring(7)}`,
              created_at: new Date().toISOString()
            } as Property
            set((state) => ({ properties: [localProp, ...state.properties] }))
            toast.success("Saved to Local Browser Storage")

            // Trigger n8n webhook for local entries too
            if (settings.n8nWebhookUrl) {
              triggerAutomation(settings.n8nWebhookUrl, 'property_created_local', {
                property: localProp,
                agent: settings.userName
              }).catch(err => console.error("Auto-webhook failed:", err))
            }
          } else {
            toast.error("Cloud Save Failed", {
              description: err.message || "Please check your Supabase permissions."
            })
          }
        }
      },

      verifyProperty: async (id, agentName, notes) => {
        try {
          await updatePropertyStatus(id, 'available', agentName, notes)
          await get().syncData()
        } catch (error) {
          console.error("Failed to verify property:", error)
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
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
    }
  )
)
