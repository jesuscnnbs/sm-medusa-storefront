"use client"

import React, { useState, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import { listMenuImages } from "@lib/actions/upload-image"
import { XMark, Check } from "@medusajs/icons"

interface ImageGallerySelectorProps {
  onSelect: (url: string) => void
  onClose: () => void
  currentValue?: string
}

export const ImageGallerySelector: React.FC<ImageGallerySelectorProps> = ({
  onSelect,
  onClose,
  currentValue
}) => {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(currentValue || null)

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
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {images.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={twMerge(
                    "relative aspect-square border-2 rounded-lg overflow-hidden",
                    "transition-all hover:scale-105",
                    selectedImage === image
                      ? "border-primary-sm shadow-[4px_4px_0px_black]"
                      : "border-dark-sm hover:border-primary-sm"
                  )}
                >
                  <img
                    src={image}
                    alt={image}
                    className="object-cover w-full h-full"
                  />
                  {selectedImage === image && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary-sm/20">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-sm">
                        <Check className="w-6 h-6 text-light-sm" />
                      </div>
                    </div>
                  )}
                </button>
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
