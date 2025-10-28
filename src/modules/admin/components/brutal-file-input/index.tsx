"use client"

import React, { useState, useRef } from "react"
import { twMerge } from "tailwind-merge"
import { uploadMenuImage } from "@lib/actions/upload-image"
import { XMark, Pencil, Photo } from "@medusajs/icons"
import { ImageGallerySelector } from "../image-gallery-selector"

interface BrutalFileInputProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  required?: boolean
  accept?: string
  maxSize?: number // in MB
  className?: string
}

export const BrutalFileInput = React.forwardRef<HTMLDivElement, BrutalFileInputProps>(
  ({
    value,
    onChange,
    label,
    required,
    accept = "image/*",
    maxSize = 5,
    className
  }, ref) => {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const [showGallery, setShowGallery] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFile = async (file: File) => {
      setError(null)

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Por favor selecciona una imagen válida")
        return
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`La imagen debe ser menor a ${maxSize}MB`)
        return
      }

      try {
        setUploading(true)

        // Create FormData
        const formData = new FormData()
        formData.append("file", file)

        // Upload to server
        const result = await uploadMenuImage(formData)

        if (result.success && result.url) {
          onChange(result.url)
        } else {
          setError(result.error || "Error al subir la imagen")
        }
      } catch (err) {
        console.error("Upload error:", err)
        setError("Error al subir la imagen")
      } finally {
        setUploading(false)
      }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
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
        handleFile(file)
      }
    }

    const handleClear = () => {
      onChange("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }

    return (
      <div ref={ref} className={twMerge("w-full", className)}>
        {label && (
          <label className="block mb-2 text-xs font-bold uppercase text-dark-sm">
            {label}
            {required && <span className="ml-1 text-red-600">*</span>}
          </label>
        )}

        {/* Upload Area */}
        {!value && (
          <div className="space-y-3">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={twMerge(
                "relative border-2 border-dashed border-dark-sm rounded-lg p-8",
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
                accept={accept}
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center text-center">
                {uploading ? (
                  <>
                    <div className="w-12 h-12 mb-3 border-4 rounded-full border-dark-sm border-t-transparent animate-spin" />
                    <p className="text-sm font-bold text-dark-sm">Subiendo imagen...</p>
                  </>
                ) : (
                  <>
                    <Pencil className="w-12 h-12 mb-3 text-dark-sm" />
                    <p className="mb-1 text-sm font-bold text-dark-sm">
                      Arrastra una imagen aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-grey-sm">
                      PNG, JPG, GIF o WebP (máx. {maxSize}MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Gallery Selector Button */}
            <button
              type="button"
              onClick={() => setShowGallery(true)}
              disabled={uploading}
              className={twMerge(
                "w-full px-4 py-3 text-sm font-bold uppercase border-2 rounded-lg",
                "border-secondary-sm-darker bg-secondary-sm text-light-sm",
                "transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]",
                "hover:shadow-[2px_2px_0px_black]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              <Photo className="w-5 h-5" />
              O seleccionar imagen existente
            </button>
          </div>
        )}

        {/* Preview */}
        {value && !uploading && (
          <div className="relative p-4 border-2 rounded-lg border-dark-sm bg-light-sm">
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden border-2 rounded-lg border-dark-sm">
                <img
                  src={value}
                  alt="Preview"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EError%3C/text%3E%3C/svg%3E"
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="mb-1 text-xs font-bold uppercase text-dark-sm">Imagen seleccionada</p>
                <p className="text-xs truncate text-grey-sm">{value}</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-xs font-bold uppercase text-primary-sm hover:underline"
                >
                  Cambiar imagen
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={accept}
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
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

        {/* Error Message */}
        {error && (
          <div className="p-2 mt-2 text-xs font-medium text-red-900 bg-red-100 border-2 border-red-600 rounded-lg">
            {error}
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

BrutalFileInput.displayName = "BrutalFileInput"
