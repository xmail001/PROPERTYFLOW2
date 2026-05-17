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
    const propertyData: Omit<Property, 'id' | 'created_at'> = {
      title: formData.get("name") as string,
      location: formData.get("city") as string,
      price: Number(formData.get("price")),
      status: "verification_required",
      last_verified: new Date().toISOString(),
      owner_confirmed: false,
      agent_confirmed: false,
    }

    try {
      await addProperty(propertyData)
      setIsSubmitting(false)
      setOpen(false)
      toast.success("Property added successfully")
      if (onAdd) onAdd(propertyData)
    } catch (error) {
      console.error(error)
      setIsSubmitting(false)
    }
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
