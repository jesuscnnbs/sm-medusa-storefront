"use client"

import { useState, useEffect, use } from "react"
import { Metadata } from "next"
import { getMenuItemById, getAllMenuCategories, updateMenuItem } from "@lib/db/queries"
import { convertGoogleDriveUrl, isValidImageUrl } from "@lib/utils/image-utils"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

interface DishDetailsProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default function DishDetailsPage({ params }: DishDetailsProps) {
  const resolvedParams = use(params)
  const [dish, setDish] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    description: "",
    descriptionEn: "",
    price: 0,
    image: "",
    categoryId: "",
    isAvailable: true,
    isPopular: false,
    ingredients: "",
    allergens: "",
    nutritionalInfo: "",
    sortOrder: 0
  })

  useEffect(() => {
    loadDishData()
    loadCategories()
  }, [resolvedParams.id])

  const loadDishData = async () => {
    try {
      const dishData = await getMenuItemById(resolvedParams.id)
      if (!dishData) {
        notFound()
      }
      setDish(dishData)
      setFormData({
        name: dishData.name || "",
        nameEn: dishData.nameEn || "",
        description: dishData.description || "",
        descriptionEn: dishData.descriptionEn || "",
        price: dishData.price || 0,
        image: dishData.image || "",
        categoryId: dishData.categoryId || "",
        isAvailable: dishData.isAvailable ?? true,
        isPopular: dishData.isPopular ?? false,
        ingredients: dishData.ingredients || "",
        allergens: dishData.allergens || "",
        nutritionalInfo: dishData.nutritionalInfo || "",
        sortOrder: dishData.sortOrder || 0
      })
    } catch (error) {
      console.error("Error loading dish:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const categoriesData = await getAllMenuCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const updatedDish = await updateMenuItem(resolvedParams.id, formData)
      setDish(updatedDish)
      setIsEditing(false)
      alert("Plato actualizado exitosamente")
    } catch (error) {
      console.error("Error saving dish:", error)
      alert("Error al guardar el plato")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (dish) {
      setFormData({
        name: dish.name || "",
        nameEn: dish.nameEn || "",
        description: dish.description || "",
        descriptionEn: dish.descriptionEn || "",
        price: dish.price || 0,
        image: dish.image || "",
        categoryId: dish.categoryId || "",
        isAvailable: dish.isAvailable ?? true,
        isPopular: dish.isPopular ?? false,
        ingredients: dish.ingredients || "",
        allergens: dish.allergens || "",
        nutritionalInfo: dish.nutritionalInfo || "",
        sortOrder: dish.sortOrder || 0
      })
    }
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-grey-sm">Cargando...</div>
      </div>
    )
  }

  if (!dish) {
    return notFound()
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/dish"
              className="inline-flex items-center mb-4 text-sm font-medium transition-colors text-primary-sm hover:text-primary-sm-darker"
            >
              ← Volver a Platos
            </Link>
            <h1 className="mb-2 text-2xl font-bold text-dark-sm">
              {isEditing ? "Editar Plato" : "Detalles del Plato"}
            </h1>
            <p className="text-grey-sm">
              {isEditing ? "Modifica la información del plato" : "Visualiza la información del plato"}
            </p>
          </div>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-primary-sm hover:bg-primary-sm-darker"
              >
                Editar Plato
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors border border-grey-sm text-grey-sm hover:bg-grey-sm hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="p-6 shadow bg-light-sm-lighter">
            <div className="grid grid-cols-1 gap-6">
              {/* Image */}
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">Imagen</label>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-32 h-32 overflow-hidden bg-gray-200 rounded-lg">
                    {(isEditing ? formData.image : dish.image) && isValidImageUrl(isEditing ? formData.image : dish.image) ? (
                      <Image
                        src={convertGoogleDriveUrl(isEditing ? formData.image : dish.image)}
                        alt={isEditing ? formData.name : dish.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-grey-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <div className="flex-1">
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => handleInputChange("image", e.target.value)}
                        placeholder="URL de la imagen"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-sm focus:border-primary-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Nombre (Español)</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-sm focus:border-primary-sm"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-md">{dish.name}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Nombre (Inglés)</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => handleInputChange("nameEn", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-sm focus:border-primary-sm"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-md">{dish.nameEn || "N/A"}</p>
                  )}
                </div>
              </div>

              {/* Description Fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Descripción (Español)</label>
                  {isEditing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-sm focus:border-primary-sm"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-md">{dish.description || "N/A"}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Descripción (Inglés)</label>
                  {isEditing ? (
                    <textarea
                      value={formData.descriptionEn}
                      onChange={(e) => handleInputChange("descriptionEn", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-sm focus:border-primary-sm"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-md">{dish.descriptionEn || "N/A"}</p>
                  )}
                </div>
              </div>

              {/* Additional Info Fields */}
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">Ingredientes</label>
                {isEditing ? (
                  <textarea
                    value={formData.ingredients}
                    onChange={(e) => handleInputChange("ingredients", e.target.value)}
                    rows={2}
                    placeholder="Lista de ingredientes separados por comas"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-sm focus:border-primary-sm"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-md">{dish.ingredients || "N/A"}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">Alérgenos</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.allergens}
                    onChange={(e) => handleInputChange("allergens", e.target.value)}
                    placeholder="Gluten, Lácteos, Frutos secos..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-sm focus:border-primary-sm"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-md">{dish.allergens || "N/A"}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">Información Nutricional</label>
                {isEditing ? (
                  <textarea
                    value={formData.nutritionalInfo}
                    onChange={(e) => handleInputChange("nutritionalInfo", e.target.value)}
                    rows={2}
                    placeholder="Calorías, proteínas, carbohidratos..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-sm focus:border-primary-sm"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-md">{dish.nutritionalInfo || "N/A"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="p-6 shadow bg-light-sm-lighter">
            <h3 className="mb-4 text-lg font-medium text-dark-sm">Información Básica</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">Precio</label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-dark-sm">$</span>
                    <input
                      type="number"
                      value={formData.price / 100}
                      onChange={(e) => handleInputChange("price", Math.round(parseFloat(e.target.value || "0") * 100))}
                      step="0.01"
                      min="0"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-sm focus:border-primary-sm"
                    />
                  </div>
                ) : (
                  <p className="px-3 py-2 text-lg font-bold bg-gray-50 rounded-md text-dark-sm">
                    ${(dish.price / 100).toFixed(2)}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">Categoría</label>
                {isEditing ? (
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange("categoryId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-sm focus:border-primary-sm"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-md">
                    {dish.category?.name || "Sin categoría"}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">Orden de clasificación</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => handleInputChange("sortOrder", parseInt(e.target.value || "0"))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-sm focus:border-primary-sm"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-md">{dish.sortOrder}</p>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="p-6 shadow bg-light-sm-lighter">
            <h3 className="mb-4 text-lg font-medium text-dark-sm">Estado</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-dark-sm">Disponible</label>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => handleInputChange("isAvailable", e.target.checked)}
                    className="w-4 h-4 rounded text-primary-sm focus:ring-primary-sm focus:ring-offset-0"
                  />
                ) : (
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    dish.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {dish.isAvailable ? 'Disponible' : 'No disponible'}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-dark-sm">Popular</label>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => handleInputChange("isPopular", e.target.checked)}
                    className="w-4 h-4 rounded text-primary-sm focus:ring-primary-sm focus:ring-offset-0"
                  />
                ) : (
                  dish.isPopular && (
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Popular
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="p-6 shadow bg-light-sm-lighter">
            <h3 className="mb-4 text-lg font-medium text-dark-sm">Metadatos</h3>
            <div className="space-y-2 text-sm text-grey-sm">
              <p><strong>Creado:</strong> {new Date(dish.createdAt).toLocaleDateString('es-ES')}</p>
              <p><strong>Actualizado:</strong> {new Date(dish.updatedAt).toLocaleDateString('es-ES')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}