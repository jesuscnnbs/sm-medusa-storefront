"use client"

import { useState, useEffect, use } from "react"
import { getMenuProfileById, toggleMenuProfileActive } from "@lib/db/queries"
import Link from "next/link"
import { notFound } from "next/navigation"

interface MenuDetailsProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default function MenuDetailsPage({ params }: MenuDetailsProps) {
  const resolvedParams = use(params)
  const [menuProfile, setMenuProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    loadMenuProfile()
  }, [resolvedParams.id])

  const loadMenuProfile = async () => {
    try {
      const profile = await getMenuProfileById(resolvedParams.id)
      if (!profile) {
        notFound()
      }
      setMenuProfile(profile)
    } catch (error) {
      console.error("Error loading menu profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async () => {
    try {
      setToggling(true)
      const updatedProfile = await toggleMenuProfileActive(resolvedParams.id)
      setMenuProfile(updatedProfile)
      
      if (updatedProfile.isActive) {
        alert("Menú activado exitosamente. Todos los demás menús han sido desactivados.")
      } else {
        alert("Menú desactivado exitosamente.")
      }
    } catch (error) {
      console.error("Error toggling menu status:", error)
      alert("Error al cambiar el estado del menú")
    } finally {
      setToggling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-grey-sm">Cargando menú...</div>
      </div>
    )
  }

  if (!menuProfile) {
    return notFound()
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/menu/all"
              className="inline-flex items-center mb-4 text-sm font-medium transition-colors text-primary-sm hover:text-primary-sm-darker"
            >
              ← Volver a Menús
            </Link>
            <h1 className="mb-2 text-2xl font-bold text-dark-sm">
              Detalles del Menú
            </h1>
            <p className="text-grey-sm">
              Gestiona la configuración de este perfil de menú
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleToggleActive}
              disabled={toggling}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                menuProfile.isActive
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {toggling ? "Cambiando..." : menuProfile.isActive ? "Desactivar Menú" : "Activar Menú"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="p-6 shadow bg-light-sm-lighter">
            <h3 className="mb-4 text-lg font-medium text-dark-sm">Información del Menú</h3>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Names */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Nombre (Español)</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md">
                    {menuProfile.name}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Nombre (Inglés)</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md">
                    {menuProfile.nameEn || "N/A"}
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Descripción (Español)</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md min-h-20">
                    {menuProfile.description || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Descripción (Inglés)</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md min-h-20">
                    {menuProfile.descriptionEn || "N/A"}
                  </div>
                </div>
              </div>

              {/* Validity Period */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Válido Desde</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md">
                    {menuProfile.validFrom 
                      ? new Date(menuProfile.validFrom).toLocaleDateString('es-ES')
                      : "Sin restricción"
                    }
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-dark-sm">Válido Hasta</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md">
                    {menuProfile.validTo 
                      ? new Date(menuProfile.validTo).toLocaleDateString('es-ES')
                      : "Sin restricción"
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Note */}
          <div className="p-4 mt-6 border-l-4 border-blue-400 bg-blue-50">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Nota:</strong> Solo un menú puede estar activo a la vez. 
                  Al activar este menú, todos los demás se desactivarán automáticamente.
                </p>
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
                  menuProfile.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {menuProfile.isActive ? 'Activo' : 'Inactivo'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-dark-sm">Menú por Defecto</label>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  menuProfile.isDefault 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {menuProfile.isDefault ? 'Sí' : 'No'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-dark-sm">Orden</label>
                <div className="px-3 py-1 text-sm bg-gray-50 rounded-md">
                  {menuProfile.sortOrder}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="p-6 shadow bg-light-sm-lighter">
            <h3 className="mb-4 text-lg font-medium text-dark-sm">Metadatos</h3>
            <div className="space-y-2 text-sm text-grey-sm">
              <p><strong>Creado:</strong> {new Date(menuProfile.createdAt).toLocaleDateString('es-ES')}</p>
              <p><strong>Actualizado:</strong> {new Date(menuProfile.updatedAt).toLocaleDateString('es-ES')}</p>
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
                Ver Platos del Menú
              </Link>
              <Link
                href={`/admin/categories`}
                className="block w-full px-4 py-2 text-sm font-medium text-center transition-colors border border-secondary-sm text-secondary-sm hover:bg-secondary-sm hover:text-white"
              >
                Gestionar Categorías
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}