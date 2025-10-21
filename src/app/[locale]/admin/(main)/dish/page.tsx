"use client"

import { getAllMenuItems, toggleMenuItemAvailability, deleteMenuItem } from "@lib/db/queries"
import { useState, useEffect } from "react"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"
import { LoaderContainer } from "@modules/admin/components/bar-loader"
import { DishCard } from "@modules/admin/components/dish-card"
import { useNotification } from "@lib/context/notification-context"

export default function AdminDishPage() {
  const { addNotification } = useNotification()
  const [dishes, setDishes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadDishes()
  }, [])

  const loadDishes = async () => {
    try {
      const data = await getAllMenuItems()
      setDishes(data)
    } catch (error) {
      console.error("Error loading dishes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAvailability = async (id: string) => {
    try {
      setActionLoading(id)
      await toggleMenuItemAvailability(id)
      await loadDishes()
      addNotification("Estado del plato actualizado exitosamente", "success")
    } catch (error) {
      console.error("Error toggling dish availability:", error)
      addNotification("Error al cambiar el estado del plato", "error")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el plato "${name}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      setActionLoading(id)
      await deleteMenuItem(id)
      await loadDishes()
      addNotification("Plato eliminado exitosamente", "success")
    } catch (error) {
      console.error("Error deleting dish:", error)
      addNotification("Error al eliminar el plato", "error")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return <LoaderContainer />
  }
  
  return (
    <>
      <div className="mb-8">
        <div className="flex gap-2 mt-4">
          <BrutalButtonLink href="/admin/dish/create" variant="secondary" size="sm">
            + Nuevo Plato
          </BrutalButtonLink>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {dishes.length === 0 ? (
          <div className="p-8 text-center border-2 rounded-3xl border-dark-sm bg-light-sm-lighter">
            <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 border-2 rounded-lg border-dark-sm bg-light-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-dark-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-bold uppercase text-dark-sm">No hay platos</h3>
            <p className="mb-6 text-grey-sm">Aún no has creado ningún plato en el menú.</p>
            <BrutalButtonLink href="/admin/dish/create" variant="primary" size="md">
              + Crear tu primer plato
            </BrutalButtonLink>
          </div>
        ) : (
          dishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              actionLoading={actionLoading}
              onToggleAvailability={handleToggleAvailability}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {dishes.length > 0 && (
        <div className="mt-8 border-2 rounded-lg border-dark-sm bg-light-sm-lighter">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-bold leading-6 uppercase text-dark-sm">
              Resumen de Platos
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="p-4 overflow-hidden border-2 rounded-md border-dark-sm bg-primary-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl font-bold text-light-sm">{dishes.length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-bold uppercase truncate text-light-sm">
                        Total Platos
                      </dt>
                      <dd className="text-xs text-light-sm">
                        En el menú
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="p-4 overflow-hidden border-2 rounded-md border-dark-sm bg-secondary-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl font-bold text-light-sm">{dishes.filter(d => d.isAvailable).length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-bold uppercase truncate text-light-sm">
                        Disponibles
                      </dt>
                      <dd className="text-xs text-light-sm">
                        Platos activos
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="p-4 overflow-hidden bg-yellow-600 border-2 rounded-md border-dark-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl font-bold text-light-sm">{dishes.filter(d => d.isPopular).length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-bold uppercase truncate text-light-sm">
                        Populares
                      </dt>
                      <dd className="text-xs text-light-sm">
                        Platos destacados
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}