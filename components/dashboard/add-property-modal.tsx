"use client"

import { useState } from "react"
import { PlusCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

import { Property } from "@/lib/types"

import { useStore } from "@/lib/store"

export function AddPropertyModal({ onAdd }: { onAdd?: (property: Partial<Property>) => void }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addProperty = useStore((state) => state.addProperty)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const property: Property = {
      id: `P-${Math.random().toString(36).substring(7).toUpperCase()}`,
      name: formData.get("name") as string,
      city: formData.get("city") as string,
      price: Number(formData.get("price")),
      status: "verification_required",
      last_verified_at: new Date().toISOString(),
      owner_confirmed: false,
      agent_confirmed: false,
      created_at: new Date().toISOString(),
    }

    // Simulate API delay but update real state
    setTimeout(() => {
      addProperty(property)
      setIsSubmitting(false)
      setOpen(false)
      toast.success("Property added successfully", {
        description: `${property.name} has been added to your inventory and is pending audit.`,
      })
      if (onAdd) onAdd(property)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Listing</DialogTitle>
            <DialogDescription>
              Enter the property details to add it to your verified inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Property Name</Label>
              <Input id="name" name="name" placeholder="e.g. Palm Villa" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Select name="city" defaultValue="Riyadh">
                  <SelectTrigger id="city">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Riyadh">Riyadh</SelectItem>
                    <SelectItem value="Jeddah">Jeddah</SelectItem>
                    <SelectItem value="Khobar">Khobar</SelectItem>
                    <SelectItem value="Dammam">Dammam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Valuation (SAR)</Label>
                <Input id="price" name="price" type="number" placeholder="4500000" required />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Save Property"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
