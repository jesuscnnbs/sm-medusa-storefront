"use client"

import { useState } from "react"
import { createMenuCategory, updateMenuCategory } from "@lib/db/queries/menu-categories"
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
import { useNotification } from "@lib/context/notification-context"

interface CategoryData {
  id?: string
  name: string
  nameEn?: string
  description?: string
  descriptionEn?: string
  image?: string
  sortOrder: number
  isActive: boolean
}

interface CategoryFormProps {
  initialData?: CategoryData
  mode: "create" | "edit"
  onSuccess?: () => void
  onCancel?: () => void
}

export default function CategoryForm({
  initialData,
  mode,
  onSuccess,
  onCancel
}: CategoryFormProps) {
  const router = useRouter()
  const { addNotification } = useNotification()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CategoryData>({
    name: initialData?.name || "",
    nameEn: initialData?.nameEn || "",
    description: initialData?.description || "",
    descriptionEn: initialData?.descriptionEn || "",
    image: initialData?.image || "",
    sortOrder: initialData?.sortOrder || 0,
    isActive: initialData?.isActive ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      addNotification("El nombre es requerido", "error")
      return
    }

    try {
      setLoading(true)

      if (mode === "create") {
        await createMenuCategory(formData)
        addNotification("Categoría creada exitosamente", "success")
      } else if (initialData?.id) {
        await updateMenuCategory(initialData.id, formData)
        addNotification("Categoría actualizada exitosamente", "success")
      } else {
        throw new Error("Invalid operation")
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/admin/categories")
      }
    } catch (error) {
      console.error("Error saving category:", error)
      addNotification("Error al guardar la categoría", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push("/admin/categories")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Content */}
        <BrutalFormContainer>
          <h3 className="mb-6 text-lg font-bold uppercase text-dark-sm">
            {mode === "create" ? "Nueva Categoría" : "Editar Categoría"}
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

            {/* Image URL */}
            <div>
              <BrutalLabel>URL de Imagen</BrutalLabel>
              <BrutalInput
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="object-cover w-32 h-32 border-2 rounded-lg border-dark-sm"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EError%3C/text%3E%3C/svg%3E"
                    }}
                  />
                </div>
              )}
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
                  label="Categoría activa"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              </div>
            </div>
          </div>
        </BrutalFormContainer>

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
              : (mode === "create" ? "Crear Categoría" : "Guardar Cambios")
            }
          </BrutalButton>
        </div>
      </form>

      {/* Info Box */}
      <BrutalAlert variant="info" className="mt-6">
        <span className="font-black uppercase">💡 Nota:</span> Las categorías se utilizan para organizar los platos en el menú.
        Puedes desactivar una categoría sin eliminarla para ocultarla temporalmente.
      </BrutalAlert>
    </div>
  )
}
