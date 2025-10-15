"use client"

import { useState, useEffect } from "react"
import { getMenuItemById, toggleMenuItemAvailability, deleteMenuItem } from "@lib/db/queries"
import DishForm from "@modules/admin/components/dish-form"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { Trash } from "@medusajs/icons"
import { useParams } from "@lib/hooks"

interface DishDetailsProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default function DishDetailsPage({ params }: DishDetailsProps) {
  const resolvedParams = useParams(params)
  const router = useRouter()
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
      alert(`Plato ${updatedDish.isAvailable ? 'activado' : 'desactivado'} exitosamente.`)
    } catch (error) {
      console.error("Error toggling dish availability:", error)
      alert("Error al cambiar el estado del plato")
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

    if (!confirm(`Estas seguro de que quieres eliminar el plato "${dish.name}"? Esta accion no se puede deshacer.`)) {
      return
    }

    try {
      setDeleting(true)
      await deleteMenuItem(resolvedParams.id)
      alert("Plato eliminado exitosamente")
      router.push("/admin/dish")
    } catch (error) {
      console.error("Error deleting dish:", error)
      alert("Error al eliminar el plato")
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
              <Link
                href="/admin/dish"
                className="inline-flex items-center mb-4 text-sm font-medium transition-colors text-primary-sm hover:text-primary-sm-darker"
              >
                Volver a Platos
              </Link>
              <h1 className="mb-2 text-2xl font-bold text-dark-sm">
                Editar Plato
              </h1>
              <p className="text-grey-sm">
                Modifica la configuracion de este plato
              </p>
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
            <Link
              href="/admin/dish"
              className="inline-flex items-center mb-4 text-sm font-medium transition-colors text-primary-sm hover:text-primary-sm-darker"
            >
              Volver a Platos
            </Link>
            <h1 className="mb-2 text-2xl font-bold text-dark-sm">
              Detalles del Plato
            </h1>
            <p className="text-grey-sm">
              Gestiona la configuracion de este plato
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-secondary-sm hover:bg-secondary-sm-darker"
            >
              Editar Plato
            </button>
            <button
              onClick={handleToggleAvailability}
              disabled={toggling}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                dish.isAvailable
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {toggling ? "Cambiando..." : dish.isAvailable ? "Desactivar Plato" : "Activar Plato"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-full hover:bg-red-700 disabled:opacity-50"
              title="Eliminar plato"
            >
              <Trash className="w-4 h-4 mr-2" />
              {deleting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="p-6 shadow bg-light-sm-lighter">
            <h3 className="mb-4 text-lg font-medium text-dark-sm">Informacion del Plato</h3>

            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Nombre (Espanol)</label>
                  <div className="px-3 py-2 rounded-md bg-gray-50">
                    {dish.name}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Nombre (Ingles)</label>
                  <div className="px-3 py-2 rounded-md bg-gray-50">
                    {dish.nameEn || "N/A"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Descripcion (Espanol)</label>
                  <div className="px-3 py-2 rounded-md bg-gray-50 min-h-20">
                    {dish.description || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Descripcion (Ingles)</label>
                  <div className="px-3 py-2 rounded-md bg-gray-50 min-h-20">
                    {dish.descriptionEn || "N/A"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Precio</label>
                  <div className="px-3 py-2 rounded-md bg-gray-50">
                    ${(dish.price / 100).toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Categoria</label>
                  <div className="px-3 py-2 rounded-md bg-gray-50">
                    {dish.category ? dish.category.name : "Sin categoria"}
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-dark-sm">Imagen</label>
                {dish.image ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="object-cover w-32 h-32 rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect fill='%23e0e0e0' width='128' height='128'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EError%3C/text%3E%3C/svg%3E"
                      }}
                    />
                    <div className="px-3 py-2 text-sm break-all rounded-md bg-gray-50">
                      {dish.image}
                    </div>
                  </div>
                ) : (
                  <div className="px-3 py-2 rounded-md bg-gray-50">
                    Sin imagen
                  </div>
                )}
              </div>

              {dish.ingredients && dish.ingredients.length > 0 && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Ingredientes</label>
                  <div className="px-3 py-2 rounded-md bg-gray-50">
                    {dish.ingredients.join(", ")}
                  </div>
                </div>
              )}

              {dish.allergens && dish.allergens.length > 0 && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Alergenos</label>
                  <div className="px-3 py-2 rounded-md bg-gray-50">
                    {dish.allergens.join(", ")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 shadow bg-light-sm-lighter">
            <h3 className="mb-4 text-lg font-medium text-dark-sm">Estado</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-dark-sm">Disponibilidad</label>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  dish.isAvailable
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {dish.isAvailable ? 'Disponible' : 'No disponible'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-dark-sm">Popular</label>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  dish.isPopular
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {dish.isPopular ? 'Si' : 'No'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-dark-sm">Orden</label>
                <div className="px-3 py-1 text-sm rounded-md bg-gray-50">
                  {dish.sortOrder}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 shadow bg-light-sm-lighter">
            <h3 className="mb-4 text-lg font-medium text-dark-sm">Metadatos</h3>
            <div className="space-y-2 text-sm text-grey-sm">
              <p><strong>Creado:</strong> {new Date(dish.createdAt).toLocaleDateString('es-ES')}</p>
              <p><strong>Actualizado:</strong> {new Date(dish.updatedAt).toLocaleDateString('es-ES')}</p>
            </div>
          </div>

          <div className="p-6 shadow bg-light-sm-lighter">
            <h3 className="mb-4 text-lg font-medium text-dark-sm">Acciones Rapidas</h3>
            <div className="space-y-3">
              <Link
                href={`/admin/categories`}
                className="block w-full px-4 py-2 text-sm font-medium text-center transition-colors border border-secondary-sm text-secondary-sm hover:bg-secondary-sm hover:text-white"
              >
                Gestionar Categorias
              </Link>
              <Link
                href={`/admin/menu`}
                className="block w-full px-4 py-2 text-sm font-medium text-center transition-colors border border-secondary-sm text-secondary-sm hover:bg-secondary-sm hover:text-white"
              >
                Gestionar Menus
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
