"use client"

import { useState, useEffect, useMemo } from "react"
import { getAllMenuProfiles, toggleMenuProfileActive, deleteMenuProfile } from "@lib/db/queries"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"
import { LoaderContainer } from "@modules/admin/components/bar-loader"
import { ProfileCard } from "@modules/admin/components/profile-card"
import { useNotification } from "@lib/context/notification-context"
import React from "react"
import { BrutalAlert } from "@modules/admin/components/brutal-form"

export default function AdminMenuProfiles() {
  const { addNotification } = useNotification()
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
      addNotification("Estado del menú actualizado exitosamente", "success")
    } catch (error) {
      console.error("Error toggling menu status:", error)
      addNotification("Error al cambiar el estado del menú", "error")
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
      addNotification("Menú eliminado exitosamente", "success")
    } catch (error) {
      console.error("Error deleting menu:", error)
      addNotification("Error al eliminar el menú", "error")
    } finally {
      setActionLoading(null)
    }
  }

  const activeProfiles = React.useMemo(() => {
    return profiles.filter(p => p.isActive).length
  }, [profiles])

  if (loading) {
    return <LoaderContainer />
  }
  
  return (
    <>
      <div className="mb-4">
        <div className="flex gap-2 mt-4">
          <BrutalButtonLink href="/admin/menu/create" variant="secondary" size="sm">
            + Crear Menú
          </BrutalButtonLink>
        </div>
      </div>

      {activeProfiles === 0 && profiles.length > 0 && (
        <BrutalAlert variant="warning" className="mb-2">
          ⚠️ Actualmente no hay menús activos. Por favor, activa al menos un menú para que esté disponible.
        </BrutalAlert>
      )}

      <div className="grid grid-cols-1 gap-6">
        {profiles.length === 0 ? (
          <div className="p-8 text-center border-2 rounded-3xl border-dark-sm bg-light-sm-lighter">
            <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 border-2 rounded-lg border-dark-sm bg-light-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-dark-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-bold uppercase text-dark-sm">No hay perfiles de menú</h3>
            <p className="mb-6 text-grey-sm">Aún no has creado ningún perfil de menú.</p>
            <BrutalButtonLink href="/admin/menu/create" variant="primary" size="md">
              + Crear tu primer menú
            </BrutalButtonLink>
          </div>
        ) : (
          profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              actionLoading={actionLoading}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {profiles.length > 0 && (
        <div className="mt-8 border-2 rounded-lg border-dark-sm bg-light-sm-lighter">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-bold leading-6 uppercase text-dark-sm">
              Resumen de Perfiles
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="p-4 overflow-hidden border-2 rounded-md border-dark-sm bg-primary-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl font-bold text-light-sm">{profiles.length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-bold uppercase truncate text-light-sm">
                        Total Perfiles
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
                    <div className="text-3xl font-bold text-light-sm">{activeProfiles}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-bold uppercase truncate text-light-sm">
                        Activos
                      </dt>
                      <dd className="text-xs text-light-sm">
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