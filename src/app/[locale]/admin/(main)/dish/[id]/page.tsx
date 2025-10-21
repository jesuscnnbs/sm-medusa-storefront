"use client"

import { useState, useEffect } from "react"
import { getMenuItemById, toggleMenuItemAvailability, deleteMenuItem } from "@lib/db/queries"
import DishForm from "@modules/admin/components/dish-form"
import Image from "next/image"
import { notFound, useRouter } from "next/navigation"
import { Trash } from "@medusajs/icons"
import { useParams } from "@lib/hooks"
import { convertGoogleDriveUrl } from "@lib/utils/image-utils"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"
import BrutalButton from "@modules/admin/components/brutal-button"
import { BrutalFormContainer, BrutalLabel } from "@modules/admin/components/brutal-form"
import { useNotification } from "@lib/context/notification-context"

interface DishDetailsProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default function DishDetailsPage({ params }: DishDetailsProps) {
  const resolvedParams = useParams(params)
  const router = useRouter()
  const { addNotification } = useNotification()
  const [dish, setDish] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (resolvedParams?.id) {
      loadDish()
    }
  }, [resolvedParams?.id])

  const loadDish = async () => {
    if (!resolvedParams?.id) return

    try {
      const data = await getMenuItemById(resolvedParams.id)
      if (!data) {
        notFound()
      }
      setDish(data)
    } catch (error) {
      console.error("Error loading dish:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAvailability = async () => {
    if (!resolvedParams?.id) return

    try {
      setToggling(true)
      const updatedDish = await toggleMenuItemAvailability(resolvedParams.id)
      setDish(updatedDish)

      if (updatedDish.isAvailable) {
        addNotification("Plato activado exitosamente", "success")
      } else {
        addNotification("Plato desactivado exitosamente", "info")
      }
    } catch (error) {
      console.error("Error toggling dish availability:", error)
      addNotification("Error al cambiar el estado del plato", "error")
    } finally {
      setToggling(false)
    }
  }

  const handleEditSuccess = () => {
    setIsEditing(false)
    loadDish()
  }

  const handleEditCancel = () => {
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!dish || !resolvedParams?.id) return

    if (!confirm(`¿Estás seguro de que quieres eliminar el plato "${dish.name}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      setDeleting(true)
      await deleteMenuItem(resolvedParams.id)
      addNotification("Plato eliminado exitosamente", "success")
      router.push("/admin/dish")
    } catch (error) {
      console.error("Error deleting dish:", error)
      addNotification("Error al eliminar el plato", "error")
    } finally {
      setDeleting(false)
    }
  }

  if (loading || !resolvedParams) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-grey-sm">Cargando plato...</div>
      </div>
    )
  }

  if (!dish) {
    return notFound()
  }

  if (isEditing) {
    return (
      <>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <BrutalButtonLink
                href="/admin/dish"
                size="sm"
                variant="neutral"
              >
                ← Volver a Platos
              </BrutalButtonLink>
            </div>
          </div>
        </div>

        <DishForm
          initialData={dish}
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
              href="/admin/dish"
              size="sm"
              variant="neutral"
            >
              ← Volver a Platos
            </BrutalButtonLink>
          </div>

          <div className="flex gap-3">
            <BrutalButton
              onClick={() => setIsEditing(true)}
              variant="secondary"
              size="sm"
            >
              Editar Plato
            </BrutalButton>
            <BrutalButton
              onClick={handleToggleAvailability}
              disabled={toggling}
              variant={dish.isAvailable ? "neutral" : "primary"}
              size="sm"
            >
              {toggling ? "Cambiando..." : dish.isAvailable ? "Desactivar" : "Activar"}
            </BrutalButton>
            <BrutalButton
              onClick={handleDelete}
              disabled={deleting}
              variant="neutral"
              size="sm"
              title="Eliminar plato"
            >
              <Trash className="inline-block w-4 h-4 mr-2" />
              {deleting ? "Eliminando..." : "Eliminar"}
            </BrutalButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BrutalFormContainer>
            <h3 className="mb-6 text-lg font-bold uppercase text-dark-sm">Información del Plato</h3>

            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <BrutalLabel>Nombre (Español)</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm">
                    {dish.name}
                  </div>
                </div>
                <div>
                  <BrutalLabel>Nombre (Inglés)</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm">
                    {dish.nameEn || "N/A"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <BrutalLabel>Descripción (Español)</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm min-h-20">
                    {dish.description || "N/A"}
                  </div>
                </div>
                <div>
                  <BrutalLabel>Descripción (Inglés)</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm min-h-20">
                    {dish.descriptionEn || "N/A"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <BrutalLabel>Precio</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm">
                    ${(dish.price / 100).toFixed(2)}
                  </div>
                </div>
                <div>
                  <BrutalLabel>Categoría</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm">
                    {dish.category ? dish.category.name : "Sin categoría"}
                  </div>
                </div>
              </div>

              <div>
                <BrutalLabel>Imagen</BrutalLabel>
                {dish.image ? (
                  <div className="flex items-center gap-4">
                    <Image
                      src={convertGoogleDriveUrl(dish.image)}
                      alt={dish.name || 'Plato'}
                      width={128}
                      height={128}
                      className="object-cover w-32 h-32 border-2 rounded-lg border-dark-sm"
                    />
                    <div className="px-3 py-2 text-sm break-all border-2 rounded-lg border-dark-sm bg-light-sm">
                      {dish.image}
                    </div>
                  </div>
                ) : (
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm">
                    Sin imagen
                  </div>
                )}
              </div>

              {dish.ingredients && dish.ingredients.length > 0 && (
                <div>
                  <BrutalLabel>Ingredientes</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm">
                    {dish.ingredients.join(", ")}
                  </div>
                </div>
              )}

              {dish.allergens && dish.allergens.length > 0 && (
                <div>
                  <BrutalLabel>Alérgenos</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm">
                    {dish.allergens.join(", ")}
                  </div>
                </div>
              )}
            </div>
          </BrutalFormContainer>
        </div>

        <div className="space-y-6">
          <BrutalFormContainer>
            <h3 className="mb-4 text-lg font-bold uppercase text-dark-sm">Estado</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <BrutalLabel className="mb-0">Disponibilidad</BrutalLabel>
                <div className={`inline-flex items-center px-3 py-1 border-2 text-xs font-bold uppercase ${
                  dish.isAvailable
                    ? 'bg-green-100 text-green-800 border-green-800'
                    : 'bg-gray-100 text-gray-800 border-gray-800'
                }`}>
                  {dish.isAvailable ? 'Disponible' : 'No disponible'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <BrutalLabel className="mb-0">Popular</BrutalLabel>
                <div className={`inline-flex items-center px-3 py-1 border-2 text-xs font-bold uppercase ${
                  dish.isPopular
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-800'
                    : 'bg-gray-100 text-gray-800 border-gray-800'
                }`}>
                  {dish.isPopular ? 'Sí' : 'No'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <BrutalLabel className="mb-0">Orden</BrutalLabel>
                <div className="px-3 py-1 text-sm border-2 border-dark-sm bg-light-sm">
                  {dish.sortOrder}
                </div>
              </div>
            </div>
          </BrutalFormContainer>

          <BrutalFormContainer>
            <h3 className="mb-4 text-lg font-bold uppercase text-dark-sm">Metadatos</h3>
            <div className="space-y-3">
              <div>
                <BrutalLabel className="mb-1">Creado</BrutalLabel>
                <div className="px-3 py-2 text-sm border-2 rounded-md border-dark-sm bg-light-sm">
                  {new Date(dish.createdAt).toLocaleDateString('es-ES')}
                </div>
              </div>
              <div>
                <BrutalLabel className="mb-1">Actualizado</BrutalLabel>
                <div className="px-3 py-2 text-sm border-2 rounded-md border-dark-sm bg-light-sm">
                  {new Date(dish.updatedAt).toLocaleDateString('es-ES')}
                </div>
              </div>
            </div>
          </BrutalFormContainer>

          <BrutalFormContainer>
            <h3 className="mb-4 text-lg font-bold uppercase text-dark-sm">Acciones Rápidas</h3>
            <div className="space-y-3">
              <BrutalButtonLink
                href="/admin/categories"
                variant="secondary"
                size="sm"
                className="block w-full text-center"
              >
                Gestionar Categorías
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
