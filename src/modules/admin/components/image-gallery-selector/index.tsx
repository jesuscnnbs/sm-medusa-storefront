"use client"

import React, { useState, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import { listMenuImages } from "@lib/actions/upload-image"
import { XMark, Check } from "@medusajs/icons"
import Image from "next/image"
import { BrutalInput } from "@modules/admin/components/brutal-form"

interface ImageGallerySelectorProps {
  onSelect: (url: string) => void
  onClose: () => void
  currentValue?: string
}

// Utilidad para limpiar el nombre de la imagen
const getCleanImageName = (imageUrl: string): string => {
  // Extraer el nombre del archivo de la URL
  const fileName = imageUrl.split('/').pop() || imageUrl

  // Remover la extensión (.jpg, .png, .webp, etc.)
  const nameWithoutExt = fileName.replace(/\.[^.]+$/, '')

  // Remover el timestamp al inicio (formato: 1761666398387-nombre.jpg)
  const nameWithoutTimestamp = nameWithoutExt.replace(/^\d+-/, '')

  // Reemplazar guiones y underscores con espacios y capitalizar
  const cleanName = nameWithoutTimestamp
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return cleanName
}

export const ImageGallerySelector: React.FC<ImageGallerySelectorProps> = ({
  onSelect,
  onClose,
  currentValue
}) => {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(currentValue || null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      setLoading(true)
      const imageList = await listMenuImages()
      setImages(imageList)
    } catch (error) {
      console.error("Error loading images:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage)
      onClose()
    }
  }

  const getFilteredImages = () => {
    if (!searchTerm) return images

    return images.filter(image => {
      const cleanName = getCleanImageName(image)
      const searchLower = searchTerm.toLowerCase()
      return cleanName.toLowerCase().includes(searchLower)
    })
  }

  const filteredImages = getFilteredImages()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-4xl max-h-[90vh] bg-light-sm border-2 border-dark-sm rounded-lg shadow-[8px_8px_0px_black] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-dark-sm">
          <h3 className="text-lg font-bold uppercase text-dark-sm">
            Seleccionar imagen existente
          </h3>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-lg hover:bg-red-100"
          >
            <XMark className="w-5 h-5 text-dark-sm" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2 border-dark-sm">
          <BrutalInput
            type="text"
            placeholder="Buscar imágenes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Gallery */}
        <div className="flex-1 p-4 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 rounded-full border-dark-sm border-t-transparent animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-sm font-bold text-dark-sm">No hay imágenes disponibles</p>
              <p className="mt-2 text-xs text-grey-sm">
                Sube una imagen nueva usando el botón de arriba
              </p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-sm font-bold text-dark-sm">No se encontraron imágenes</p>
              <p className="mt-2 text-xs text-grey-sm">
                Intenta con otro término de búsqueda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredImages.map((image) => (
                <div key={image} className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={twMerge(
                      "relative aspect-square border-2 rounded-lg overflow-hidden",
                      "transition-all hover:scale-105",
                      selectedImage === image
                        ? "border-primary-sm shadow-brutal-primary"
                        : "border-dark-sm hover:border-primary-sm"
                    )}
                  >
                    <Image
                      src={image}
                      alt={getCleanImageName(image)}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                    {selectedImage === image && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary-sm/20">
                        <div className="flex items-center justify-center w-10 h-10 p-3 rounded-full bg-primary-sm">
                          <Check className="w-6 h-4 text-light-sm" />
                        </div>
                      </div>
                    )}
                  </button>
                  <p className="text-xs font-medium text-center truncate text-dark-sm">
                    {getCleanImageName(image)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t-2 border-dark-sm">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold uppercase transition-colors border-2 rounded-lg border-dark-sm bg-light-sm hover:bg-grey-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSelect}
            disabled={!selectedImage}
            className={twMerge(
              "px-6 py-2 text-sm font-bold uppercase border-2 rounded-lg",
              "border-primary-sm-darker text-light-sm transition-all",
              selectedImage
                ? "bg-primary-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_black]"
                : "bg-grey-sm cursor-not-allowed opacity-50"
            )}
          >
            Seleccionar
          </button>
        </div>
      </div>
    </div>
  )
}
