"use client"

import { listMenuCategories, toggleMenuCategoryActive, hardDeleteMenuCategory } from "@lib/db/queries/menu-categories"
import { useState, useEffect } from "react"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"
import { LoaderContainer } from "@modules/admin/components/bar-loader"
import { CategoryCard } from "@modules/admin/components/category-card"
import { useNotification } from "@lib/context/notification-context"

export default function AdminCategories() {
  const { addNotification } = useNotification()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await listMenuCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      setActionLoading(id)
      await toggleMenuCategoryActive(id)
      await loadCategories()
      addNotification("Estado de la categoría actualizado exitosamente", "success")
    } catch (error) {
      console.error("Error toggling category status:", error)
      addNotification("Error al cambiar el estado de la categoría", "error")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${name}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      setActionLoading(id)
      await hardDeleteMenuCategory(id)
      await loadCategories()
      addNotification("Categoría eliminada exitosamente", "success")
    } catch (error) {
      console.error("Error deleting category:", error)
      addNotification("Error al eliminar la categoría", "error")
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
          <BrutalButtonLink href="/admin/categories/create" variant="secondary" size="sm">
            + Crear Categoría
          </BrutalButtonLink>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {categories.length === 0 ? (
          <div className="p-8 text-center border-2 rounded-3xl border-dark-sm bg-light-sm-lighter">
            <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 border-2 rounded-lg border-dark-sm bg-light-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-dark-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-bold uppercase text-dark-sm">No hay categorías</h3>
            <p className="mb-6 text-grey-sm">Aún no has creado ninguna categoría.</p>
            <BrutalButtonLink href="/admin/categories/create" variant="primary" size="md">
              + Crear tu primera categoría
            </BrutalButtonLink>
          </div>
        ) : (
          categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              actionLoading={actionLoading}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {categories.length > 0 && (
        <div className="mt-8 border-2 rounded-lg border-dark-sm bg-light-sm-lighter">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-bold leading-6 uppercase text-dark-sm">
              Resumen de Categorías
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="p-4 overflow-hidden border-2 rounded-md border-dark-sm bg-primary-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl font-bold text-light-sm">{categories.length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-bold uppercase truncate text-light-sm">
                        Total Categorías
                      </dt>
                      <dd className="text-xs text-light-sm">
                        En el sistema
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="p-4 overflow-hidden border-2 rounded-md border-dark-sm bg-secondary-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl font-bold text-light-sm">{categories.filter(c => c.isActive).length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-bold uppercase truncate text-light-sm">
                        Activas
                      </dt>
                      <dd className="text-xs text-light-sm">
                        Categorías habilitadas
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