"use client"

import { useState } from "react"
import { createMenuCategory, updateMenuCategory } from "@lib/db/queries/menu-categories"
import { useRouter } from "next/navigation"

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
      alert("El nombre es requerido")
      return
    }

    try {
      setLoading(true)

      if (mode === "create") {
        await createMenuCategory(formData)
        alert("Categoría creada exitosamente")
      } else if (initialData?.id) {
        await updateMenuCategory(initialData.id, formData)
        alert("Categoría actualizada exitosamente")
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
      alert("Error al guardar la categoría")
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
        <div className="p-6 shadow bg-light-sm-lighter">
          <h3 className="mb-6 text-lg font-medium text-dark-sm">
            {mode === "create" ? "Nueva Categoría" : "Editar Categoría"}
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

            {/* Image URL */}
            <div>
              <label className="block mb-2 text-sm font-medium text-dark-sm">
                URL de Imagen
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-sm focus:border-transparent"
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="object-cover w-32 h-32 rounded-md"
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
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary-sm bg-gray-100 border-gray-300 rounded focus:ring-primary-sm focus:ring-2"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-dark-sm">
                  Categoría activa
                </label>
              </div>
            </div>
          </div>
        </div>

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
              : (mode === "create" ? "Crear Categoría" : "Guardar Cambios")
            }
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="p-4 mt-6 border-l-4 border-blue-400 bg-blue-50">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Las categorías se utilizan para organizar los platos en el menú.
              Puedes desactivar una categoría sin eliminarla para ocultarla temporalmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
