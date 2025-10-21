"use client"

import { useState, useEffect } from "react"
import { createMenuItem, updateMenuItem } from "@lib/db/queries"
import { listMenuCategories } from "@lib/db/queries/menu-categories"
import { useRouter } from "next/navigation"
import BrutalButton from "../brutal-button"
import {
  BrutalLabel,
  BrutalInput,
  BrutalTextarea,
  BrutalCheckbox,
  BrutalFormContainer,
  BrutalAlert,
  BrutalSelect,
} from "../brutal-form"
import { useNotification } from "@lib/context/notification-context"

interface DishData {
  id?: string
  name: string
  nameEn?: string
  description?: string
  descriptionEn?: string
  price: number
  categoryId?: string
  image?: string
  isAvailable: boolean
  isPopular: boolean
  ingredients?: string[]
  allergens?: string[]
  sortOrder: number
}

interface DishFormProps {
  initialData?: DishData
  mode: "create" | "edit"
  onSuccess?: () => void
  onCancel?: () => void
}

export default function DishForm({
  initialData,
  mode,
  onSuccess,
  onCancel
}: DishFormProps) {
  const router = useRouter()
  const { addNotification } = useNotification()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState<DishData>({
    name: initialData?.name || "",
    nameEn: initialData?.nameEn || "",
    description: initialData?.description || "",
    descriptionEn: initialData?.descriptionEn || "",
    price: initialData?.price || 0,
    categoryId: initialData?.categoryId || "",
    image: initialData?.image || "",
    isAvailable: initialData?.isAvailable ?? true,
    isPopular: initialData?.isPopular || false,
    ingredients: initialData?.ingredients || [],
    allergens: initialData?.allergens || [],
    sortOrder: initialData?.sortOrder || 0,
  })

  const [ingredientsText, setIngredientsText] = useState(
    initialData?.ingredients?.join(", ") || ""
  )
  const [allergensText, setAllergensText] = useState(
    initialData?.allergens?.join(", ") || ""
  )

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await listMenuCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      addNotification("El nombre es requerido", "error")
      return
    }

    if (formData.price < 0) {
      addNotification("El precio debe ser mayor o igual a 0", "error")
      return
    }

    try {
      setLoading(true)

      const dataToSubmit = {
        ...formData,
        ingredients: ingredientsText
          ? ingredientsText.split(",").map(i => i.trim()).filter(Boolean)
          : [],
        allergens: allergensText
          ? allergensText.split(",").map(a => a.trim()).filter(Boolean)
          : [],
        categoryId: formData.categoryId || null,
      }

      if (mode === "create") {
        await createMenuItem(dataToSubmit)
        addNotification("Plato creado exitosamente", "success")
      } else if (initialData?.id) {
        await updateMenuItem(initialData.id, dataToSubmit)
        addNotification("Plato actualizado exitosamente", "success")
      } else {
        throw new Error("Invalid operation")
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/admin/dish")
      }
    } catch (error) {
      console.error("Error saving dish:", error)
      addNotification("Error al guardar el plato", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push("/admin/dish")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <BrutalFormContainer>
          <h3 className="mb-6 text-lg font-bold uppercase text-dark-sm">
            {mode === "create" ? "Nuevo Plato" : "Editar Plato"}
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

            {/* Price and Category */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <BrutalLabel required>Precio (en céntimos)</BrutalLabel>
                <BrutalInput
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  min="0"
                  required
                />
                <p className="mt-1 text-xs text-grey-sm">
                  Ejemplo: 1250 = €12.50
                </p>
              </div>
              <div>
                <BrutalLabel>Categoría</BrutalLabel>
                <select
                  value={formData.categoryId || ""}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value || undefined })}
                  className="w-full px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm focus:outline-none focus:ring-2 focus:ring-primary-sm text-dark-sm"
                >
                  <option value="">Sin categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image */}
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

            {/* Ingredients and Allergens */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <BrutalLabel>Ingredientes (separados por comas)</BrutalLabel>
                <BrutalTextarea
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  rows={3}
                  placeholder="Carne, Lechuga, Tomate, Cebolla"
                />
              </div>
              <div>
                <BrutalLabel>Alérgenos (separados por comas)</BrutalLabel>
                <BrutalTextarea
                  value={allergensText}
                  onChange={(e) => setAllergensText(e.target.value)}
                  rows={3}
                  placeholder="Gluten, Lácteos, Frutos secos"
                />
              </div>
            </div>

            {/* Additional Settings */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                  id="isAvailable"
                  label="Disponible"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                />
              </div>
              <div className="space-y-4">
                <BrutalCheckbox
                  id="isPopular"
                  label="Popular"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
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
              : (mode === "create" ? "Crear Plato" : "Guardar Cambios")
            }
          </BrutalButton>
        </div>
      </form>

      {/* Info Box */}
      <BrutalAlert variant="info" className="mt-6">
        <span className="font-black uppercase">💡 Nota:</span> Los platos se organizan por categorías en el menú.
        El precio debe ingresarse en céntimos (1250 = €12.50).
      </BrutalAlert>
    </div>
  )
}
