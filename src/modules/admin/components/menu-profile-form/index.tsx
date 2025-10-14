"use client"

import { useState, useEffect } from "react"
import { createMenuProfile, updateMenuProfile, getMenuProfileItems, setMenuProfileItems } from "@lib/db/queries"
import MenuItemSelector from "../menu-item-selector"
import { useRouter } from "next/navigation"

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
        router.push("/admin/menu/all")
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
      router.push("/admin/menu/all")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Content */}
        <div className="p-6 shadow bg-light-sm-lighter">
          <h3 className="mb-6 text-lg font-medium text-dark-sm">
            {mode === "create" ? "Nuevo Menú" : "Editar Menú"}
          </h3>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Names */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">
                  Nombre (Español) *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-sm focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">
                  Nombre (Inglés)
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-sm focus:border-transparent"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">
                  Descripción (Español)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-sm focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">
                  Descripción (Inglés)
                </label>
                <textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-sm focus:border-transparent"
                />
              </div>
            </div>

            {/* Validity Period */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">
                  Válido Desde
                </label>
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-sm focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">
                  Válido Hasta
                </label>
                <input
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-sm focus:border-transparent"
                />
              </div>
            </div>

            {/* Additional Settings */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">
                  Orden de Clasificación
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-sm focus:border-transparent"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-primary-sm bg-gray-100 border-gray-300 rounded focus:ring-primary-sm focus:ring-2"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm font-medium text-dark-sm">
                    Menú activo
                  </label>
                </div>
                {formData.isActive && (
                  <div className="p-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md">
                    ⚠️ <strong>Importante:</strong> Solo un menú puede estar activo a la vez. 
                    Si activas este menú, cualquier otro menú activo será desactivado automáticamente.
                  </div>
                )}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 text-primary-sm bg-gray-100 border-gray-300 rounded focus:ring-primary-sm focus:ring-2"
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm font-medium text-dark-sm">
                    Menú por defecto
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items Selection */}
        <MenuItemSelector
          selectedItemIds={selectedMenuItems}
          onSelectionChange={setSelectedMenuItems}
          locale="es"
        />

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-primary-sm border border-transparent rounded-md hover:bg-primary-sm-darker focus:outline-none focus:ring-2 focus:ring-primary-sm focus:ring-offset-2 disabled:opacity-50"
          >
            {loading 
              ? (mode === "create" ? "Creando..." : "Guardando...") 
              : (mode === "create" ? "Crear Menú" : "Guardar Cambios")
            }
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="p-4 mt-6 border-l-4 border-blue-400 bg-blue-50">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Solo un menú puede estar activo a la vez. Si activas este menú, 
              todos los demás menús se desactivarán automáticamente. El menú "por defecto" se usa 
              cuando no hay ningún menú activo específico.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}