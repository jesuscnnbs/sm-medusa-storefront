"use client"

import { useState, useEffect } from "react"
import { getMenuCategoryById, toggleMenuCategoryActive, hardDeleteMenuCategory } from "@lib/db/queries/menu-categories"
import CategoryForm from "@modules/admin/components/category-form"
import { notFound, useRouter } from "next/navigation"
import { Trash, CircleMinus, CircleSolid } from "@medusajs/icons"
import { useParams } from "@lib/hooks"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"
import BrutalButton from "@modules/admin/components/brutal-button"
import { BrutalFormContainer, BrutalLabel, BrutalAlert } from "@modules/admin/components/brutal-form"
import { useNotification } from "@lib/context/notification-context"

interface CategoryDetailsProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default function CategoryDetailsPage({ params }: CategoryDetailsProps) {
  const resolvedParams = useParams(params)
  const router = useRouter()
  const { addNotification } = useNotification()
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

      if (updatedCategory.isActive) {
        addNotification("Categoría activada exitosamente", "success")
      } else {
        addNotification("Categoría desactivada exitosamente", "info")
      }
    } catch (error) {
      console.error("Error toggling category status:", error)
      addNotification("Error al cambiar el estado de la categoría", "error")
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
      addNotification("Categoría eliminada exitosamente", "success")
      router.push("/admin/categories")
    } catch (error) {
      console.error("Error deleting category:", error)
      addNotification("Error al eliminar la categoría", "error")
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
              <BrutalButtonLink
                href="/admin/categories"
                size="sm"
                variant="neutral"
              >
                ← Volver a Categorías
              </BrutalButtonLink>
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
            <BrutalButtonLink
              href="/admin/categories"
              size="sm"
              variant="neutral"
            >
              ← Volver a Categorías
            </BrutalButtonLink>
          </div>

          <div className="flex gap-3">
            <BrutalButton
              onClick={() => setIsEditing(true)}
              variant="secondary"
              size="sm"
            >
              Editar Categoría
            </BrutalButton>
            <BrutalButton
              onClick={handleToggleActive}
              disabled={toggling}
              variant={category.isActive ? "neutral" : "primary"}
              size="sm"
            >
              {category.isActive ? (
                <>
                <CircleMinus className="inline-block w-4 h-4 mr-2" />
                <span>Desactivar</span>
                </>
              ) : (
                <>
                <CircleSolid className="inline-block w-4 h-4 mr-2" />
                <span>Activar</span>
                </>
              )}
            </BrutalButton>
            <BrutalButton
              onClick={handleDelete}
              disabled={deleting}
              variant="neutral"
              size="sm"
              title="Eliminar categoría"
            >
              <Trash className="inline-block w-4 h-4 mr-2" />
              {deleting ? "Eliminando..." : "Eliminar"}
            </BrutalButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <BrutalFormContainer>
            <h3 className="mb-6 text-lg font-bold uppercase text-dark-sm">Información de la Categoría</h3>

            <div className="grid grid-cols-1 gap-6">
              {/* Names */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <BrutalLabel>Nombre (Español)</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm">
                    {category.name}
                  </div>
                </div>
                <div>
                  <BrutalLabel>Nombre (Inglés)</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm">
                    {category.nameEn || "N/A"}
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <BrutalLabel>Descripción (Español)</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm min-h-20">
                    {category.description || "N/A"}
                  </div>
                </div>
                <div>
                  <BrutalLabel>Descripción (Inglés)</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm min-h-20">
                    {category.descriptionEn || "N/A"}
                  </div>
                </div>
              </div>

              {/* Image */}
              {/*<div>
                <BrutalLabel>Imagen</BrutalLabel>
                {category.image ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="object-cover w-32 h-32 border-2 rounded-lg border-dark-sm"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect fill='%23e0e0e0' width='128' height='128'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EError%3C/text%3E%3C/svg%3E"
                      }}
                    />
                    <div className="px-3 py-2 text-sm break-all border-2 rounded-lg border-dark-sm bg-light-sm">
                      {category.image}
                    </div>
                  </div>
                ) : (
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm">
                    Sin imagen
                  </div>
                )}
              </div>
              */}
            </div>
          </BrutalFormContainer>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <BrutalFormContainer>
            <h3 className="mb-4 text-lg font-bold uppercase text-dark-sm">Estado</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <BrutalLabel className="mb-0">Estado Actual</BrutalLabel>
                <div className={`inline-flex items-center px-3 py-1 border-2 text-xs font-bold uppercase ${
                  category.isActive
                    ? 'bg-green-100 text-green-800 border-green-800'
                    : 'bg-gray-100 text-gray-800 border-gray-800'
                }`}>
                  {category.isActive ? 'Activa' : 'Inactiva'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <BrutalLabel className="mb-0">Orden</BrutalLabel>
                <div className="px-3 py-1 text-sm border-2 border-dark-sm bg-light-sm">
                  {category.sortOrder}
                </div>
              </div>
            </div>
          </BrutalFormContainer>

          {/* Metadata */}
          <BrutalFormContainer>
            <h3 className="mb-4 text-lg font-bold uppercase text-dark-sm">Metadatos</h3>
            <div className="space-y-3">
              <div>
                <BrutalLabel className="mb-1">Creado</BrutalLabel>
                <div className="px-3 py-2 text-sm border-2 rounded-md border-dark-sm bg-light-sm">
                  {new Date(category.createdAt).toLocaleDateString('es-ES')}
                </div>
              </div>
              <div>
                <BrutalLabel className="mb-1">Actualizado</BrutalLabel>
                <div className="px-3 py-2 text-sm border-2 rounded-md border-dark-sm bg-light-sm">
                  {new Date(category.updatedAt).toLocaleDateString('es-ES')}
                </div>
              </div>
            </div>
          </BrutalFormContainer>

          {/* Quick Actions */}
          <BrutalFormContainer>
            <h3 className="mb-4 text-lg font-bold uppercase text-dark-sm">Acciones Rápidas</h3>
            <div className="space-y-3">
              <BrutalButtonLink
                href="/admin/dish"
                variant="secondary"
                size="sm"
                className="block w-full text-center"
              >
                Ver Platos
              </BrutalButtonLink>
              <BrutalButtonLink
                href="/admin/menu"
                variant="secondary"
                size="sm"
                className="block w-full text-center"
              >
                Gestionar Menús
              </BrutalButtonLink>
            </div>
          </BrutalFormContainer>
        </div>
      </div>
    </>
  )
}
