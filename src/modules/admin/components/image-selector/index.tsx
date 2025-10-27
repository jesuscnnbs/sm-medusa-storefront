"use client"

import React, { useState } from "react"
import { twMerge } from "tailwind-merge"
import { XMark, Photo } from "@medusajs/icons"
import { ImageGallerySelector } from "../image-gallery-selector"

interface ImageSelectorProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  required?: boolean
  className?: string
}

/**
 * Simple image selector - only allows selecting from existing images
 * No upload functionality (managed in /admin/menu-images)
 */
export const ImageSelector = React.forwardRef<HTMLDivElement, ImageSelectorProps>(
  ({ value, onChange, label, required, className }, ref) => {
    const [showGallery, setShowGallery] = useState(false)

    const handleClear = () => {
      onChange("")
    }

    return (
      <div ref={ref} className={twMerge("w-full", className)}>
        {label && (
          <label className="block mb-2 text-xs font-bold uppercase text-dark-sm">
            {label}
            {required && <span className="ml-1 text-red-600">*</span>}
          </label>
        )}

        {/* Select Image Button */}
        {!value && (
          <button
            type="button"
            onClick={() => setShowGallery(true)}
            className={twMerge(
              "w-full px-6 py-8 text-sm font-bold uppercase border-2 border-dashed rounded-lg",
              "border-dark-sm bg-light-sm transition-all",
              "hover:bg-light-sm-lighter hover:translate-x-[-2px] hover:translate-y-[-2px]",
              "hover:shadow-[2px_2px_0px_black]",
              "flex flex-col items-center justify-center gap-3"
            )}
          >
            <Photo className="w-12 h-12 text-dark-sm" />
            <span>Seleccionar imagen de la galería</span>
            <span className="text-xs normal-case text-grey-sm">
              Gestiona imágenes en /admin/menu-images
            </span>
          </button>
        )}

        {/* Preview */}
        {value && (
          <div className="relative p-4 border-2 rounded-lg border-dark-sm bg-light-sm">
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden border-2 rounded-lg border-dark-sm">
                <img
                  src={value}
                  alt="Preview"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EError%3C/text%3E%3C/svg%3E"
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="mb-1 text-xs font-bold uppercase text-dark-sm">
                  Imagen seleccionada
                </p>
                <p className="text-xs truncate text-grey-sm">{value}</p>
                <button
                  type="button"
                  onClick={() => setShowGallery(true)}
                  className="mt-2 text-xs font-bold uppercase text-primary-sm hover:underline"
                >
                  Cambiar imagen
                </button>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="flex-shrink-0 p-2 transition-colors rounded-lg hover:bg-red-100"
                title="Eliminar imagen"
              >
                <XMark className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        )}

        {/* Gallery Modal */}
        {showGallery && (
          <ImageGallerySelector
            currentValue={value}
            onSelect={(url) => {
              onChange(url)
              setShowGallery(false)
            }}
            onClose={() => setShowGallery(false)}
          />
        )}
      </div>
    )
  }
)

ImageSelector.displayName = "ImageSelector"
