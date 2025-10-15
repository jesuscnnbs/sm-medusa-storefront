"use client"

import { listMenuCategories, toggleMenuCategoryActive, hardDeleteMenuCategory } from "@lib/db/queries/menu-categories"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Trash } from "@medusajs/icons"

export default function AdminCategories() {
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
      alert("Estado de la categoría actualizado exitosamente")
    } catch (error) {
      console.error("Error toggling category status:", error)
      alert("Error al cambiar el estado de la categoría")
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
      alert("Categoría eliminada exitosamente")
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Error al eliminar la categoría")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-grey-sm">Cargando categorías...</div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-dark-sm">Categorías</h1>
        <p className="text-grey-sm">Gestiona las categorías de platos que organizan tu menú.</p>
        <div className="flex gap-2 mt-4">
          <Link
            href="/admin/categories/create"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors border border-primary-sm bg-primary-sm hover:bg-primary-sm-darker"
          >
            + Crear Categoría
          </Link>
          <Link
            href="/admin/menu"
            className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors border border-secondary-sm text-secondary-sm hover:bg-secondary-sm hover:text-white"
          >
            ← Menús
          </Link>
          <Link
            href="/admin/dish"
            className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors border border-secondary-sm text-secondary-sm hover:bg-secondary-sm hover:text-white"
          >
            Platos →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {categories.length === 0 ? (
          <div className="p-8 text-center bg-light-sm-lighter">
            <div className="mb-4 text-grey-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-dark-sm">No hay categorías</h3>
            <p className="mb-4 text-grey-sm">Aún no has creado ninguna categoría.</p>
            <Link
              href="/admin/categories/create"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-primary-sm hover:bg-primary-sm-darker rounded"
            >
              + Crear tu primera categoría
            </Link>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="overflow-hidden rounded-lg shadow bg-light-sm-lighter">
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="flex-shrink-0">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="object-cover w-12 h-12 rounded"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%23e0e0e0' width='48' height='48'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E%3F%3C/text%3E%3C/svg%3E"
                          }}
                        />
                      ) : (
                        <div className={`flex items-center rounded justify-center w-12 h-12 ${category.isActive ? 'bg-primary-sm' : 'bg-secondary-sm'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-white size-6">
                            <path d="M3.196 12.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 12.87z" />
                            <path d="M3.196 8.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 8.87z" />
                            <path d="M10.38 1.103a.75.75 0 00-.76 0l-7.25 4.25a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.76 0l7.25-4.25a.75.75 0 000-1.294l-7.25-4.25z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 ml-5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate text-dark-sm">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="mt-1 text-sm text-grey-sm line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.isActive ? 'Activa' : 'Inactiva'}
                      </div>
                      <div className="mt-1 text-xs text-grey-sm">
                        Orden: {category.sortOrder}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleActive(category.id)}
                        disabled={actionLoading === category.id}
                        className={`px-3 py-1 text-xs font-medium text-white rounded transition-colors disabled:opacity-50 ${
                          category.isActive
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {actionLoading === category.id ? "..." : category.isActive ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={actionLoading === category.id}
                        className="p-2 text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
                        title="Eliminar categoría"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 bg-light-sm">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-grey-sm">
                    Creado: {new Date(category.createdAt).toLocaleDateString('es-ES')}
                  </div>
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="px-1 text-sm font-medium transition-colors text-primary-sm hover:text-primary-sm-darker"
                  >
                    Ver/Editar →
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {categories.length > 0 && (
        <div className="mt-8 rounded-lg shadow bg-light-sm-lighter">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-medium leading-6 text-dark-sm">
              Resumen de Categorías
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="p-4 overflow-hidden rounded shadow bg-primary-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-light-sm">{categories.length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-medium truncate text-light-sm">
                        Total Categorías
                      </dt>
                      <dd className="text-sm text-light-sm">
                        En el sistema
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="p-4 overflow-hidden bg-green-600 rounded shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-white">{categories.filter(c => c.isActive).length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-medium text-white truncate">
                        Activas
                      </dt>
                      <dd className="text-sm text-white">
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