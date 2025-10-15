"use client"

import { useState, useEffect } from "react"
import { createMenuItem, updateMenuItem } from "@lib/db/queries"
import { listMenuCategories } from "@lib/db/queries/menu-categories"
import { useRouter } from "next/navigation"

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
      alert("El nombre es requerido")
      return
    }

    if (formData.price < 0) {
      alert("El precio debe ser mayor o igual a 0")
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
        alert("Plato creado exitosamente")
      } else if (initialData?.id) {
        await updateMenuItem(initialData.id, dataToSubmit)
        alert("Plato actualizado exitosamente")
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
      alert("Error al guardar el plato")
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
        <div className="p-6 shadow bg-light-sm-lighter">
          <h3 className="mb-6 text-lg font-medium text-dark-sm">
            {mode === "create" ? "Nuevo Plato" : "Editar Plato"}
          </h3>

          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">
                  Nombre (Espanol) *
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
                  Nombre (Ingles)
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-sm focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">
                  Descripcion (Espanol)
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
                  Descripcion (Ingles)
                </label>
                <textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-sm focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">
                  Precio (en centavos) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-sm focus:border-transparent"
                  required
                />
                <p className="mt-1 text-xs text-grey-sm">
                  Ejemplo: 1250 = $12.50
                </p>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">
                  Categoria
                </label>
                <select
                  value={formData.categoryId || ""}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-sm focus:border-transparent"
                >
                  <option value="">Sin categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">
                  Ingredientes (separados por comas)
                </label>
                <textarea
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  rows={3}
                  placeholder="Carne, Lechuga, Tomate, Cebolla"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-sm focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">
                  Alergenos (separados por comas)
                </label>
                <textarea
                  value={allergensText}
                  onChange={(e) => setAllergensText(e.target.value)}
                  rows={3}
                  placeholder="Gluten, Lacteos, Frutos secos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-sm focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">
                  Orden de Clasificacion
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
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 text-primary-sm bg-gray-100 border-gray-300 rounded focus:ring-primary-sm focus:ring-2"
                />
                <label htmlFor="isAvailable" className="ml-2 text-sm font-medium text-dark-sm">
                  Disponible
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  className="w-4 h-4 text-primary-sm bg-gray-100 border-gray-300 rounded focus:ring-primary-sm focus:ring-2"
                />
                <label htmlFor="isPopular" className="ml-2 text-sm font-medium text-dark-sm">
                  Popular
                </label>
              </div>
            </div>
          </div>
        </div>

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
              : (mode === "create" ? "Crear Plato" : "Guardar Cambios")
            }
          </button>
        </div>
      </form>

      <div className="p-4 mt-6 border-l-4 border-blue-400 bg-blue-50">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Los platos se organizan por categorias en el menu.
              El precio debe ingresarse en centavos (1250 = $12.50).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
