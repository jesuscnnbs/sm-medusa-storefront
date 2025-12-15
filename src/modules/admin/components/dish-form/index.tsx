"use client"

import { useState, useEffect } from "react"
import { createMenuItem, updateMenuItem } from "@lib/db/queries"
import { listMenuCategories } from "@lib/db/queries/menu-categories"
import { useRouter } from "next/navigation"
import Image from "next/image"
import BrutalButton from "../brutal-button"
import {
  BrutalLabel,
  BrutalInput,
  BrutalTextarea,
  BrutalCheckbox,
  BrutalFormContainer,
  BrutalAlert,
  BrutalMarkdownEditor,
} from "../brutal-form"
import { ImageSelector } from "../image-selector"
import { useNotification } from "@lib/context/notification-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Valid allergens based on available icons
const VALID_ALLERGENS = [
  "egg",
  "sesame",
  "celery",
  "sulfites",
  "nuts",
  "lupins",
  "soy",
  "mustard",
  "peanut",
  "shellfish",
  "gluten",
  "milk",
  "crustaceans",
  "fish",
] as const

const ALLERGEN_LABELS: Record<string, string> = {
  egg: "Huevo / Egg",
  sesame: "Sésamo / Sesame",
  celery: "Apio / Celery",
  sulfites: "Sulfitos / Sulfites",
  nuts: "Frutos secos / Nuts",
  lupins: "Altramuces / Lupins",
  soy: "Soja / Soy",
  mustard: "Mostaza / Mustard",
  peanut: "Cacahuete / Peanut",
  shellfish: "Moluscos / Shellfish",
  gluten: "Gluten / Gluten",
  milk: "Lácteos / Milk",
  crustaceans: "Crustáceos / Crustaceans",
  fish: "Pescado / Fish",
}

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

  // Check for invalid allergens from initial data
  const invalidAllergens = (initialData?.allergens || []).filter(
    (allergen) => !VALID_ALLERGENS.includes(allergen as any)
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

      // Filter out invalid allergens before saving
      const validAllergensOnly = (formData.allergens || []).filter((allergen) =>
        VALID_ALLERGENS.includes(allergen as any)
      )

      const dataToSubmit = {
        ...formData,
        allergens: validAllergensOnly,
        ingredients: ingredientsText
          ? ingredientsText.split(",").map(i => i.trim()).filter(Boolean)
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
              <BrutalMarkdownEditor
                label="Descripción (Español)"
                value={formData.description || ""}
                onChange={(value) => setFormData({ ...formData, description: value })}
                rows={4}
                placeholder="Ej: **Deliciosa** hamburguesa con ingredientes frescos..."
              />
              <BrutalMarkdownEditor
                label="Descripción (Inglés)"
                value={formData.descriptionEn || ""}
                onChange={(value) => setFormData({ ...formData, descriptionEn: value })}
                rows={4}
                placeholder="Ex: **Delicious** burger with fresh ingredients..."
              />
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
              <ImageSelector
                label="Imagen del Plato"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />
              <p className="mt-2 text-xs text-grey-sm">
                💡 Gestiona las imágenes (subir/eliminar) en <LocalizedClientLink href="/admin/image-gallery" className="font-bold underline text-primary-sm">Admin → Imágenes del Menú</LocalizedClientLink>
              </p>
            </div>

            {/* Ingredients */}
            <div>
              <BrutalLabel>Ingredientes (separados por comas)</BrutalLabel>
              <BrutalTextarea
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                rows={3}
                placeholder="Carne, Lechuga, Tomate, Cebolla"
              />
            </div>

            {/* Allergens Multi-Select */}
            <div>
              <BrutalLabel>Alérgenos</BrutalLabel>

              {/* Warning for invalid allergens */}
              {invalidAllergens.length > 0 && (
                <BrutalAlert variant="warning" className="mb-4">
                  <span className="font-black uppercase">⚠️ Advertencia:</span> Los siguientes alérgenos no son válidos: <strong>{invalidAllergens.join(", ")}</strong>.
                  Estos valores no se guardarán en el servidor. Por favor, selecciona solo alérgenos de la lista disponible.
                </BrutalAlert>
              )}

              <div className="grid grid-cols-1 gap-3 p-4 border-2 rounded-lg md:grid-cols-2 lg:grid-cols-3 border-dark-sm bg-light-sm">
                {VALID_ALLERGENS.map((allergen) => (
                  <div key={allergen} className="flex items-center gap-2 p-2 rounded border border-grey-sm/20 hover:border-primary-sm/50 transition-colors">
                    <Image
                      src={`/icons/alergens/${allergen}.svg`}
                      alt={allergen}
                      width={24}
                      height={24}
                      className="flex-shrink-0"
                    />
                    <BrutalCheckbox
                      id={`allergen-${allergen}`}
                      label={ALLERGEN_LABELS[allergen]}
                      checked={formData.allergens?.includes(allergen) || false}
                      onChange={(e) => {
                        const newAllergens = e.target.checked
                          ? [...(formData.allergens || []), allergen]
                          : (formData.allergens || []).filter((a) => a !== allergen)
                        setFormData({ ...formData, allergens: newAllergens })
                      }}
                      labelClassName="text-xs"
                    />
                  </div>
                ))}
              </div>

              {formData.allergens && formData.allergens.length > 0 && (
                <p className="mt-2 text-xs text-grey-sm">
                  Seleccionados: {formData.allergens.join(", ")}
                </p>
              )}
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
