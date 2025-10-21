"use client"

import { useState, useEffect } from "react"
import { createMenuProfile, updateMenuProfile, getMenuProfileItems, setMenuProfileItems } from "@lib/db/queries"
import MenuItemSelector from "../menu-item-selector"
import { useRouter } from "next/navigation"
import BrutalButton from "../brutal-button"
import {
  BrutalLabel,
  BrutalInput,
  BrutalTextarea,
  BrutalCheckbox,
  BrutalFormContainer,
  BrutalAlert,
} from "../brutal-form"

interface MenuProfileData {
  id?: string
  name: string
  nameEn?: string
  description?: string
  descriptionEn?: string
  validFrom?: string
  validTo?: string
  sortOrder: number
  isDefault: boolean
  isActive: boolean
}

interface MenuProfileFormProps {
  initialData?: MenuProfileData
  mode: "create" | "edit"
  onSuccess?: () => void
  onCancel?: () => void
}

export default function MenuProfileForm({ 
  initialData, 
  mode, 
  onSuccess,
  onCancel 
}: MenuProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([])
  const [formData, setFormData] = useState<MenuProfileData>({
    name: initialData?.name || "",
    nameEn: initialData?.nameEn || "",
    description: initialData?.description || "",
    descriptionEn: initialData?.descriptionEn || "",
    validFrom: initialData?.validFrom || "",
    validTo: initialData?.validTo || "",
    sortOrder: initialData?.sortOrder || 0,
    isDefault: initialData?.isDefault || false,
    isActive: initialData?.isActive || false,
  })

  useEffect(() => {
    if (mode === "edit" && initialData?.id) {
      loadMenuProfileItems()
    }
  }, [mode, initialData?.id])

  const loadMenuProfileItems = async () => {
    if (!initialData?.id) return
    
    try {
      const items = await getMenuProfileItems(initialData.id)
      setSelectedMenuItems(items.map(item => item.id))
    } catch (error) {
      console.error("Error loading menu profile items:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert("El nombre es requerido")
      return
    }

    try {
      setLoading(true)

      const dataToSubmit = {
        ...formData,
        validFrom: formData.validFrom ? new Date(formData.validFrom) : null,
        validTo: formData.validTo ? new Date(formData.validTo) : null,
      }

      let menuProfileId: string

      if (mode === "create") {
        const newProfile = await createMenuProfile(dataToSubmit)
        menuProfileId = newProfile.id
        alert("Menú creado exitosamente")
      } else if (initialData?.id) {
        await updateMenuProfile(initialData.id, dataToSubmit)
        menuProfileId = initialData.id
        alert("Menú actualizado exitosamente")
      } else {
        throw new Error("Invalid operation")
      }

      // Update menu items association
      await setMenuProfileItems(menuProfileId, selectedMenuItems)

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/admin/menu")
      }
    } catch (error) {
      console.error("Error saving menu profile:", error)
      alert("Error al guardar el menú")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push("/admin/menu")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Content */}
        <BrutalFormContainer>
          <h3 className="mb-6 text-lg font-bold uppercase text-dark-sm">
            {mode === "create" ? "Nuevo Menú" : "Editar Menú"}
          </h3>

          <div className="grid grid-cols-1 gap-6">
            {/* Names */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <BrutalLabel required>Nombre (Español)</BrutalLabel>
                <BrutalInput
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <BrutalLabel>Nombre (Inglés)</BrutalLabel>
                <BrutalInput
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <BrutalLabel>Descripción (Español)</BrutalLabel>
                <BrutalTextarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <BrutalLabel>Descripción (Inglés)</BrutalLabel>
                <BrutalTextarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            {/* Validity Period */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <BrutalLabel>Válido Desde</BrutalLabel>
                <BrutalInput
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                />
              </div>
              <div>
                <BrutalLabel>Válido Hasta</BrutalLabel>
                <BrutalInput
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                />
              </div>
            </div>

            {/* Additional Settings */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <BrutalLabel>Orden de Clasificación</BrutalLabel>
                <BrutalInput
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-4">
                <BrutalCheckbox
                  id="isActive"
                  label="Menú activo"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                {formData.isActive && (
                  <BrutalAlert variant="warning">
                    <span className="font-black">⚠️ IMPORTANTE:</span> Solo un menú puede estar activo a la vez.
                    Si activas este menú, cualquier otro menú activo será desactivado automáticamente.
                  </BrutalAlert>
                )}
                <BrutalCheckbox
                  id="isDefault"
                  label="Menú por defecto"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                />
              </div>
            </div>
          </div>
        </BrutalFormContainer>

        {/* Menu Items Selection */}
        <MenuItemSelector
          selectedItemIds={selectedMenuItems}
          onSelectionChange={setSelectedMenuItems}
          locale="es"
        />

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <BrutalButton
            type="button"
            onClick={handleCancel}
            disabled={loading}
            variant="neutral"
            size="md"
          >
            Cancelar
          </BrutalButton>
          <BrutalButton
            type="submit"
            disabled={loading}
            variant="primary"
            size="md"
          >
            {loading
              ? (mode === "create" ? "Creando..." : "Guardando...")
              : (mode === "create" ? "Crear Menú" : "Guardar Cambios")
            }
          </BrutalButton>
        </div>
      </form>

      {/* Info Box */}
      <BrutalAlert variant="info" className="mt-6">
        <span className="font-black uppercase">💡 Nota:</span> Solo un menú puede estar activo a la vez. Si activas este menú,
        todos los demás menús se desactivarán automáticamente. El menú "por defecto" se usa
        cuando no hay ningún menú activo específico.
      </BrutalAlert>
    </div>
  )
}