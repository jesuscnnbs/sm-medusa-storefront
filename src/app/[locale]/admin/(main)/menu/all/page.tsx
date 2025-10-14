"use client"

import { Metadata } from "next"
import { getAllMenuProfiles, toggleMenuProfileActive, deleteMenuProfile } from "@lib/db/queries"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Trash } from "@medusajs/icons"

export default function AdminMenuProfiles() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    try {
      const data = await getAllMenuProfiles()
      setProfiles(data)
    } catch (error) {
      console.error("Error loading profiles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      setActionLoading(id)
      await toggleMenuProfileActive(id)
      await loadProfiles()
      alert("Estado del menú actualizado exitosamente")
    } catch (error) {
      console.error("Error toggling menu status:", error)
      alert("Error al cambiar el estado del menú")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el menú "${name}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      setActionLoading(id)
      await deleteMenuProfile(id)
      await loadProfiles()
      alert("Menú eliminado exitosamente")
    } catch (error) {
      console.error("Error deleting menu:", error)
      alert("Error al eliminar el menú")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-grey-sm">Cargando menús...</div>
      </div>
    )
  }
  
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-dark-sm">Mis menús</h1>
        <p className="text-grey-sm">Gestiona los menús que has creado utilizando los elementos y las categorías definidos.</p>
        <div className="flex gap-2 mt-4">
          <Link
            href="/admin/menu/create"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors border border-primary-sm bg-primary-sm hover:bg-primary-sm-darker"
          >
            + Crear Menú
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors border border-secondary-sm text-secondary-sm hover:bg-secondary-sm hover:text-white"
          >
            Categorías →
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
        {profiles.length === 0 ? (
          <div className="p-8 text-center bg-light-sm-lighter">
            <div className="mb-4 text-grey-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-dark-sm">No hay perfiles de menú</h3>
            <p className="mb-4 text-grey-sm">Aún no has creado ningún perfil de menú.</p>
            <Link
              href="/admin/menu/create"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-primary-sm hover:bg-primary-sm-darker rounded"
            >
              + Crear tu primer menú
            </Link>
          </div>
        ) : (
          profiles.map((profile) => (
            <div key={profile.id} className="overflow-hidden rounded-lg shadow bg-light-sm-lighter">
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="flex-shrink-0">
                      <div className={`flex items-center rounded justify-center w-12 h-12 ${profile.isActive ? 'bg-primary-sm' : 'bg-secondary-sm'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-white size-6">
                          <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 ml-5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate text-dark-sm">
                            {profile.name}
                          </h3>
                          {profile.description && (
                            <p className="mt-1 text-sm text-grey-sm line-clamp-2">
                              {profile.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        profile.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {profile.isActive ? 'Activo' : 'Inactivo'}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleActive(profile.id)}
                        disabled={actionLoading === profile.id}
                        className={`px-3 py-1 text-xs font-medium text-white rounded transition-colors disabled:opacity-50 ${
                          profile.isActive
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {actionLoading === profile.id ? "..." : profile.isActive ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => handleDelete(profile.id, profile.name)}
                        disabled={actionLoading === profile.id}
                        className="p-2 text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
                        title="Eliminar menú"
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
                    Creado: {new Date(profile.createdAt).toLocaleDateString('es-ES')}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <Link
                      href={`/admin/menu/${profile.id}`}
                      className="px-1 text-sm font-medium transition-colors text-primary-sm hover:text-primary-sm-darker"
                    >
                      Ver/Editar →
                    </Link>
                    <Link
                      href="/admin/dish"
                      className="px-1 text-sm font-medium transition-colors text-secondary-sm hover:text-secondary-sm-darker"
                    >
                      Ver Platos →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {profiles.length > 0 && (
        <div className="mt-8 rounded-lg shadow bg-light-sm-lighter">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-medium leading-6 text-dark-sm">
              Resumen de Perfiles
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="p-4 overflow-hidden rounded shadow bg-primary-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-light-sm">{profiles.length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-medium truncate text-light-sm">
                        Total Perfiles
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
                    <div className="text-2xl font-bold text-white">{profiles.filter(p => p.isActive).length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-medium text-white truncate">
                        Activos
                      </dt>
                      <dd className="text-sm text-white">
                        Perfiles habilitados
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