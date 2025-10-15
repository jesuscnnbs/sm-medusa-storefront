"use client"

import { getAllMenuItems, toggleMenuItemAvailability, deleteMenuItem } from "@lib/db/queries"
import { convertGoogleDriveUrl, isValidImageUrl } from "@lib/utils/image-utils"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Trash } from "@medusajs/icons"

export default function AdminDishPage() {
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
      alert("Estado del plato actualizado exitosamente")
    } catch (error) {
      console.error("Error toggling dish availability:", error)
      alert("Error al cambiar el estado del plato")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Estas seguro de que quieres eliminar el plato "${name}"? Esta accion no se puede deshacer.`)) {
      return
    }

    try {
      setActionLoading(id)
      await deleteMenuItem(id)
      await loadDishes()
      alert("Plato eliminado exitosamente")
    } catch (error) {
      console.error("Error deleting dish:", error)
      alert("Error al eliminar el plato")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-grey-sm">Cargando platos...</div>
      </div>
    )
  }
  
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-dark-sm">Platos del Menu</h1>
        <p className="text-grey-sm">Gestiona todos los platos disponibles en el menu.</p>
        <div className="flex gap-2 mt-4">
          <Link
            href="/admin/dish/create"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-primary-sm hover:bg-primary-sm-darker"
          >
            + Nuevo Plato
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors border border-secondary-sm text-secondary-sm hover:bg-secondary-sm hover:text-white"
          >
            Categorias
          </Link>
          <Link
            href="/admin/menu"
            className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors border border-secondary-sm text-secondary-sm hover:bg-secondary-sm hover:text-white"
          >
            Menus
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {dishes.length === 0 ? (
          <div className="p-8 text-center bg-light-sm-lighter">
            <div className="mb-4 text-grey-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-dark-sm">No hay platos</h3>
            <p className="mb-4 text-grey-sm">Aun no has creado ningun plato en el menu.</p>
            <Link
              href="/admin/dish/create"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-primary-sm hover:bg-primary-sm-darker rounded"
            >
              + Crear tu primer plato
            </Link>
          </div>
        ) : (
          dishes.map((dish) => (
            <div key={dish.id} className="overflow-hidden shadow bg-light-sm-lighter">
              <div className="flex items-center p-4">
                <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-200 rounded-lg">
                  {dish.image && isValidImageUrl(dish.image) ? (
                    <Image
                      src={convertGoogleDriveUrl(dish.image)}
                      alt={dish.name || 'Plato'}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-grey-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 ml-4 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate text-dark-sm">
                        {dish.name}
                      </h3>
                      {dish.category && (
                        <p className="text-sm text-primary-sm">
                          {dish.category.name}
                        </p>
                      )}
                      {dish.description && (
                        <p 
                          className="mt-1 text-sm text-grey-sm"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {dish.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center ml-4 space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-dark-sm">
                          ${(dish.price / 100).toFixed(2)}
                        </div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          dish.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {dish.isAvailable ? 'Disponible' : 'No disponible'}
                        </div>
                        {dish.isPopular && (
                          <div className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Popular
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleToggleAvailability(dish.id)}
                          disabled={actionLoading === dish.id}
                          className={`px-3 py-1 text-xs font-medium text-white rounded transition-colors disabled:opacity-50 ${
                            dish.isAvailable
                              ? 'bg-orange-600 hover:bg-orange-700'
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {actionLoading === dish.id ? "..." : dish.isAvailable ? 'Desactivar' : 'Activar'}
                        </button>
                        <Link
                          href={`/admin/dish/${dish.id}`}
                          className="px-3 py-1 text-xs font-medium text-center transition-colors text-primary-sm hover:text-primary-sm-darker bg-gray-100 rounded"
                        >
                          Ver/Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(dish.id, dish.name)}
                          disabled={actionLoading === dish.id}
                          className="px-3 py-1 text-xs font-medium transition-colors text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {dishes.length > 0 && (
        <div className="mt-8 shadow bg-light-sm-lighter">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-medium leading-6 text-dark-sm">
              Resumen de Platos
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="p-4 overflow-hidden shadow bg-primary-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-light-sm">{dishes.length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-medium truncate text-light-sm">
                        Total Platos
                      </dt>
                      <dd className="text-sm text-light-sm">
                        En el menú
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              
              <div className="p-4 overflow-hidden bg-green-600 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-white">{dishes.filter(d => d.isAvailable).length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-medium text-white truncate">
                        Disponibles
                      </dt>
                      <dd className="text-sm text-white">
                        Platos activos
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="p-4 overflow-hidden bg-yellow-600 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-white">{dishes.filter(d => d.isPopular).length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-medium text-white truncate">
                        Populares
                      </dt>
                      <dd className="text-sm text-white">
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