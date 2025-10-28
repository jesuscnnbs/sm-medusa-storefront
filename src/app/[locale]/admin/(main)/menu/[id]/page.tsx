"use client"

import { useState, useEffect } from "react"
import { getMenuProfileById, toggleMenuProfileActive, deleteMenuProfile } from "@lib/db/queries"
import MenuProfileForm from "@modules/admin/components/menu-profile-form"
import { notFound, useRouter } from "next/navigation"
import { CircleMinus, CircleSolid, Trash } from "@medusajs/icons"
import { useParams } from "@lib/hooks"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"
import BrutalButton from "@modules/admin/components/brutal-button"
import { BrutalFormContainer, BrutalLabel, BrutalAlert } from "@modules/admin/components/brutal-form"
import { useNotification } from "@lib/context/notification-context"

interface MenuDetailsProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default function MenuDetailsPage({ params }: MenuDetailsProps) {
  const resolvedParams = useParams(params)
  const router = useRouter()
  const { addNotification } = useNotification()
  const [menuProfile, setMenuProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (resolvedParams?.id) {
      loadMenuProfile()
    }
  }, [resolvedParams?.id])

  const loadMenuProfile = async () => {
    if (!resolvedParams?.id) return
    
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
    if (!resolvedParams?.id) return

    try {
      setToggling(true)
      const updatedProfile = await toggleMenuProfileActive(resolvedParams.id)
      setMenuProfile(updatedProfile)

      if (updatedProfile.isActive) {
        addNotification("Menú activado exitosamente. Todos los demás menús han sido desactivados.", "success")
      } else {
        addNotification("Menú desactivado exitosamente.", "info")
      }
    } catch (error) {
      console.error("Error toggling menu status:", error)
      addNotification("Error al cambiar el estado del menú", "error")
    } finally {
      setToggling(false)
    }
  }

  const handleEditSuccess = () => {
    setIsEditing(false)
    loadMenuProfile()
  }

  const handleEditCancel = () => {
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!menuProfile || !resolvedParams?.id) return

    if (!confirm(`¿Estás seguro de que quieres eliminar el menú "${menuProfile.name}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      setDeleting(true)
      await deleteMenuProfile(resolvedParams.id)
      addNotification("Menú eliminado exitosamente", "success")
      router.push("/admin/menu")
    } catch (error) {
      console.error("Error deleting menu:", error)
      addNotification("Error al eliminar el menú", "error")
    } finally {
      setDeleting(false)
    }
  }

  if (loading || !resolvedParams) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-grey-sm">Cargando menú...</div>
      </div>
    )
  }

  if (!menuProfile) {
    return notFound()
  }

  // Convert date fields for form
  const formattedMenuProfile = {
    ...menuProfile,
    validFrom: menuProfile.validFrom ? new Date(menuProfile.validFrom).toISOString().split('T')[0] : "",
    validTo: menuProfile.validTo ? new Date(menuProfile.validTo).toISOString().split('T')[0] : "",
  }

  if (isEditing) {
    return (
      <>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <BrutalButtonLink
                href="/admin/menu"
                size="sm"
                variant="neutral"
              >
                ← Volver a Menús
              </BrutalButtonLink>
            </div>
          </div>
        </div>

        <MenuProfileForm 
          initialData={formattedMenuProfile}
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
              href="/admin/menu"
              size="sm"
              variant="neutral"

            >
              ← Volver a Menús
            </BrutalButtonLink>
          </div>
          
          <div className="flex gap-3">
            <BrutalButton
              onClick={() => setIsEditing(true)}
              variant="secondary"
              size="sm"
            >
              Editar Menú
            </BrutalButton>
            <BrutalButton
              onClick={handleToggleActive}
              disabled={toggling}
              variant={menuProfile.isActive ? "neutral" : "primary"}
              size="sm"
            >
              {menuProfile.isActive ? (
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
              title="Eliminar menú"
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
            <h3 className="mb-6 text-lg font-bold uppercase text-dark-sm">Información del Menú</h3>

            <div className="grid grid-cols-1 gap-6">
              {/* Names */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <BrutalLabel>Nombre (Español)</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm">
                    {menuProfile.name}
                  </div>
                </div>
                <div>
                  <BrutalLabel>Nombre (Inglés)</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm">
                    {menuProfile.nameEn || "N/A"}
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <BrutalLabel>Descripción (Español)</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm min-h-20">
                    {menuProfile.description || "N/A"}
                  </div>
                </div>
                <div>
                  <BrutalLabel>Descripción (Inglés)</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm min-h-20">
                    {menuProfile.descriptionEn || "N/A"}
                  </div>
                </div>
              </div>

              {/* Validity Period */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <BrutalLabel>Válido Desde</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm">
                    {menuProfile.validFrom
                      ? new Date(menuProfile.validFrom).toLocaleDateString('es-ES')
                      : "Sin restricción"
                    }
                  </div>
                </div>
                <div>
                  <BrutalLabel>Válido Hasta</BrutalLabel>
                  <div className="px-3 py-2 border-2 rounded-lg border-dark-sm bg-light-sm">
                    {menuProfile.validTo
                      ? new Date(menuProfile.validTo).toLocaleDateString('es-ES')
                      : "Sin restricción"
                    }
                  </div>
                </div>
              </div>
            </div>
          </BrutalFormContainer>

          {/* Action Note */}
          <BrutalAlert variant="info" className="mt-6">
            <p>
              <strong>Nota:</strong> Solo un menú puede estar activo a la vez.
              Al activar este menú, todos los demás se desactivarán automáticamente.
            </p>
          </BrutalAlert>
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
                  menuProfile.isActive
                    ? 'bg-green-100 text-green-800 border-green-800'
                    : 'bg-gray-100 text-gray-800 border-gray-800'
                }`}>
                  {menuProfile.isActive ? 'Activo' : 'Inactivo'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <BrutalLabel className="mb-0">Menú por Defecto</BrutalLabel>
                <div className={`inline-flex items-center px-3 py-1 border-2 text-xs font-bold uppercase ${
                  menuProfile.isDefault
                    ? 'bg-blue-100 text-blue-800 border-blue-800'
                    : 'bg-gray-100 text-gray-800 border-gray-800'
                }`}>
                  {menuProfile.isDefault ? 'Sí' : 'No'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <BrutalLabel className="mb-0">Orden</BrutalLabel>
                <div className="px-3 py-1 text-sm border-2 border-dark-sm bg-light-sm">
                  {menuProfile.sortOrder}
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
                  {new Date(menuProfile.createdAt).toLocaleDateString('es-ES')}
                </div>
              </div>
              <div>
                <BrutalLabel className="mb-1">Actualizado</BrutalLabel>
                <div className="px-3 py-2 text-sm border-2 rounded-md border-dark-sm bg-light-sm">
                  {new Date(menuProfile.updatedAt).toLocaleDateString('es-ES')}
                </div>
              </div>
            </div>
          </BrutalFormContainer>
        </div>
      </div>
    </>
  )
}