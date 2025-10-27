"use client"

import { useState, useEffect, useRef } from "react"
import { listMenuImages, uploadMenuImage, deleteMenuImage } from "@lib/actions/upload-image"
import { Trash, Pencil, Photo } from "@medusajs/icons"
import { twMerge } from "tailwind-merge"
import { canModifyFileSystem } from "@lib/utils/environment"
import { useNotification } from "@lib/context/notification-context"

export default function MenuImagesPage() {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [isLocalhost, setIsLocalhost] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addNotification } = useNotification()

  useEffect(() => {
    loadImages()
    setIsLocalhost(canModifyFileSystem())
  }, [])

  const loadImages = async () => {
    try {
      setLoading(true)
      const imageList = await listMenuImages()
      setImages(imageList)
    } catch (error) {
      console.error("Error loading images:", error)
      addNotification("Error al cargar las imágenes", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (file: File) => {
    if (!isLocalhost) {
      addNotification("Las subidas solo están disponibles en localhost", "error")
      return
    }

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadMenuImage(formData)

      if (result.success) {
        addNotification("Imagen subida exitosamente", "success")
        await loadImages()
      } else {
        addNotification(result.error || "Error al subir la imagen", "error")
      }
    } catch (error) {
      console.error("Upload error:", error)
      addNotification("Error al subir la imagen", "error")
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleDelete = async (imageUrl: string) => {
    if (!isLocalhost) {
      addNotification("La eliminación solo está disponible en localhost", "error")
      return
    }

    const filename = imageUrl.split("/").pop()
    if (!confirm(`¿Eliminar ${filename}? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      const result = await deleteMenuImage(imageUrl)

      if (result.success) {
        addNotification("Imagen eliminada exitosamente", "success")
        await loadImages()
      } else {
        addNotification(result.error || "Error al eliminar la imagen", "error")
      }
    } catch (error) {
      console.error("Delete error:", error)
      addNotification("Error al eliminar la imagen", "error")
    }
  }

  return (
    <div className="container max-w-6xl py-8 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase font-lemonMilk text-dark-sm">
          Gestión de Imágenes del Menú
        </h1>
        <p className="mt-2 text-sm text-grey-sm">
          Administra las imágenes que se utilizan en los platos del menú
        </p>
      </div>

      {/* Environment Warning */}
      {!isLocalhost && (
        <div className="p-4 mb-6 text-sm font-medium text-orange-900 bg-orange-100 border-2 border-orange-600 rounded-lg">
          <p className="font-bold">⚠️ Solo lectura en producción</p>
          <p className="mt-1">
            La subida y eliminación de imágenes solo está disponible en localhost.
            Para gestionar imágenes, ejecuta el proyecto localmente.
          </p>
        </div>
      )}

      {/* Upload Area */}
      {isLocalhost && (
        <div className="mb-8">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={twMerge(
              "relative border-2 border-dashed border-dark-sm rounded-lg p-12",
              "bg-light-sm cursor-pointer transition-all",
              "hover:bg-light-sm-lighter hover:translate-x-[-2px] hover:translate-y-[-2px]",
              "hover:shadow-[2px_2px_0px_black]",
              dragActive && "bg-primary-sm/10 border-primary-sm",
              uploading && "opacity-50 cursor-wait"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center text-center">
              {uploading ? (
                <>
                  <div className="w-16 h-16 mb-4 border-4 rounded-full border-dark-sm border-t-transparent animate-spin" />
                  <p className="text-lg font-bold text-dark-sm">Subiendo imagen...</p>
                </>
              ) : (
                <>
                  <Pencil className="w-16 h-16 mb-4 text-dark-sm" />
                  <p className="mb-2 text-lg font-bold text-dark-sm">
                    Arrastra una imagen aquí o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-grey-sm">
                    PNG, JPG, GIF o WebP (máx. 5MB)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery */}
      <div className="p-6 border-2 rounded-lg border-dark-sm bg-light-sm-lighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold uppercase text-dark-sm">
            Galería de Imágenes ({images.length})
          </h2>
          <button
            onClick={loadImages}
            disabled={loading}
            className="px-4 py-2 text-xs font-bold uppercase transition-colors border-2 rounded-lg border-dark-sm bg-light-sm hover:bg-grey-sm disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Recargar"}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 rounded-full border-dark-sm border-t-transparent animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Photo className="w-16 h-16 mb-4 text-grey-sm" />
            <p className="text-lg font-bold text-dark-sm">No hay imágenes disponibles</p>
            {isLocalhost ? (
              <p className="mt-2 text-sm text-grey-sm">
                Arrastra una imagen arriba para comenzar
              </p>
            ) : (
              <p className="mt-2 text-sm text-grey-sm">
                Ejecuta el proyecto en localhost para subir imágenes
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image) => {
              const filename = image.split("/").pop() || ""
              return (
                <div
                  key={image}
                  className="relative overflow-hidden border-2 rounded-lg group border-dark-sm bg-light-sm"
                >
                  <div className="aspect-square">
                    <img
                      src={image}
                      alt={filename}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-2 border-t-2 border-dark-sm">
                    <p className="text-xs font-medium truncate text-dark-sm" title={filename}>
                      {filename}
                    </p>
                  </div>

                  {/* Delete Button (only on localhost) */}
                  {isLocalhost && (
                    <button
                      onClick={() => handleDelete(image)}
                      className="absolute p-2 transition-opacity bg-red-500 rounded-lg opacity-0 top-2 right-2 group-hover:opacity-100 hover:bg-red-600"
                      title="Eliminar imagen"
                    >
                      <Trash className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Info Alert */}
      <div className="p-4 mt-6 text-sm font-medium text-blue-900 bg-blue-100 border-2 border-blue-600 rounded-lg">
        <p className="font-bold">💡 Cómo funciona:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Las imágenes se guardan en <code className="px-1 py-0.5 bg-blue-200 rounded">/public/menu/</code></li>
          <li>Subir/eliminar imágenes solo funciona en localhost (desarrollo)</li>
          <li>Para publicar cambios: <code className="px-1 py-0.5 bg-blue-200 rounded">git add . && git commit -m && git push</code></li>
          <li>Vercel desplegará automáticamente en 1-2 minutos</li>
        </ul>
      </div>
    </div>
  )
}
