"use client"

import { useState, useEffect } from "react"
import { getMenuCategoryById, toggleMenuCategoryActive, hardDeleteMenuCategory } from "@lib/db/queries/menu-categories"
import CategoryForm from "@modules/admin/components/category-form"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { Trash } from "@medusajs/icons"
import { useParams } from "@lib/hooks"

interface CategoryDetailsProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default function CategoryDetailsPage({ params }: CategoryDetailsProps) {
  const resolvedParams = useParams(params)
  const router = useRouter()
  const [category, setCategory] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (resolvedParams?.id) {
      loadCategory()
    }
  }, [resolvedParams?.id])

  const loadCategory = async () => {
    if (!resolvedParams?.id) return

    try {
      const data = await getMenuCategoryById(resolvedParams.id)
      if (!data) {
        notFound()
      }
      setCategory(data)
    } catch (error) {
      console.error("Error loading category:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async () => {
    if (!resolvedParams?.id) return

    try {
      setToggling(true)
      const updatedCategory = await toggleMenuCategoryActive(resolvedParams.id)
      setCategory(updatedCategory)
      alert(`Categoría ${updatedCategory.isActive ? 'activada' : 'desactivada'} exitosamente.`)
    } catch (error) {
      console.error("Error toggling category status:", error)
      alert("Error al cambiar el estado de la categoría")
    } finally {
      setToggling(false)
    }
  }

  const handleEditSuccess = () => {
    setIsEditing(false)
    loadCategory()
  }

  const handleEditCancel = () => {
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!category || !resolvedParams?.id) return

    if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      setDeleting(true)
      await hardDeleteMenuCategory(resolvedParams.id)
      alert("Categoría eliminada exitosamente")
      router.push("/admin/categories")
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Error al eliminar la categoría")
    } finally {
      setDeleting(false)
    }
  }

  if (loading || !resolvedParams) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-grey-sm">Cargando categoría...</div>
      </div>
    )
  }

  if (!category) {
    return notFound()
  }

  if (isEditing) {
    return (
      <>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin/categories"
                className="inline-flex items-center mb-4 text-sm font-medium transition-colors text-primary-sm hover:text-primary-sm-darker"
              >
                Volver a Categorías
              </Link>
              <h1 className="mb-2 text-2xl font-bold text-dark-sm">
                Editar Categoría
              </h1>
              <p className="text-grey-sm">
                Modifica la configuración de esta categoría
              </p>
            </div>
          </div>
        </div>

        <CategoryForm
          initialData={category}
          mode="edit"
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      </>
    )
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/categories"
              className="inline-flex items-center mb-4 text-sm font-medium transition-colors text-primary-sm hover:text-primary-sm-darker"
            >
              Volver a Categorías
            </Link>
            <h1 className="mb-2 text-2xl font-bold text-dark-sm">
              Detalles de la Categoría
            </h1>
            <p className="text-grey-sm">
              Gestiona la configuración de esta categoría
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-secondary-sm hover:bg-secondary-sm-darker"
            >
              Editar Categoría
            </button>
            <button
              onClick={handleToggleActive}
              disabled={toggling}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                category.isActive
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {toggling ? "Cambiando..." : category.isActive ? "Desactivar Categoría" : "Activar Categoría"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-full hover:bg-red-700 disabled:opacity-50"
              title="Eliminar categoría"
            >
              <Trash className="w-4 h-4 mr-2" />
              {deleting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="p-6 shadow bg-light-sm-lighter">
            <h3 className="mb-4 text-lg font-medium text-dark-sm">Información de la Categoría</h3>

            <div className="grid grid-cols-1 gap-6">
              {/* Names */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Nombre (Español)</label>
                  <div className="px-3 py-2 rounded-md bg-gray-50">
                    {category.name}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Nombre (Inglés)</label>
                  <div className="px-3 py-2 rounded-md bg-gray-50">
                    {category.nameEn || "N/A"}
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Descripción (Español)</label>
                  <div className="px-3 py-2 rounded-md bg-gray-50 min-h-20">
                    {category.description || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Descripción (Inglés)</label>
                  <div className="px-3 py-2 rounded-md bg-gray-50 min-h-20">
                    {category.descriptionEn || "N/A"}
                  </div>
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">Imagen</label>
                {category.image ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="object-cover w-32 h-32 rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect fill='%23e0e0e0' width='128' height='128'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EError%3C/text%3E%3C/svg%3E"
                      }}
                    />
                    <div className="px-3 py-2 text-sm break-all rounded-md bg-gray-50">
                      {category.image}
                    </div>
                  </div>
                ) : (
                  <div className="px-3 py-2 rounded-md bg-gray-50">
                    Sin imagen
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="p-6 shadow bg-light-sm-lighter">
            <h3 className="mb-4 text-lg font-medium text-dark-sm">Estado</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-dark-sm">Estado Actual</label>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  category.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.isActive ? 'Activa' : 'Inactiva'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-dark-sm">Orden</label>
                <div className="px-3 py-1 text-sm rounded-md bg-gray-50">
                  {category.sortOrder}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="p-6 shadow bg-light-sm-lighter">
            <h3 className="mb-4 text-lg font-medium text-dark-sm">Metadatos</h3>
            <div className="space-y-2 text-sm text-grey-sm">
              <p><strong>Creado:</strong> {new Date(category.createdAt).toLocaleDateString('es-ES')}</p>
              <p><strong>Actualizado:</strong> {new Date(category.updatedAt).toLocaleDateString('es-ES')}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 shadow bg-light-sm-lighter">
            <h3 className="mb-4 text-lg font-medium text-dark-sm">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Link
                href={`/admin/dish`}
                className="block w-full px-4 py-2 text-sm font-medium text-center transition-colors border border-secondary-sm text-secondary-sm hover:bg-secondary-sm hover:text-white"
              >
                Ver Platos de esta Categoría
              </Link>
              <Link
                href={`/admin/menu`}
                className="block w-full px-4 py-2 text-sm font-medium text-center transition-colors border border-secondary-sm text-secondary-sm hover:bg-secondary-sm hover:text-white"
              >
                Gestionar Menús
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
