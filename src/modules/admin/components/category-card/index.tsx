"use client"

import React from "react"
import { Trash } from "@medusajs/icons"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"
import { CircularText } from "@modules/admin/components/circular-text"
import { BrutalToggle } from "@modules/admin/components/brutal-toggle"
import { twMerge } from "tailwind-merge"
import BrutalButton from "../brutal-button"

interface CategoryCardProps {
  category: {
    id: string
    name: string
    description?: string
    isActive: boolean
    image?: string | null
    sortOrder: number
    createdAt: Date | string
  }
  actionLoading: string | null
  onToggleActive: (id: string) => void
  onDelete: (id: string, name: string) => void
}

export const CategoryCard = ({
  category,
  actionLoading,
  onToggleActive,
  onDelete,
}: CategoryCardProps) => {
  return (
    <div className="overflow-hidden border-2 rounded-lg border-dark-sm bg-light-sm-lighter">
      <div className="p-4 overflow-hidden">
        {category.isActive && (
          <CircularText
            text="Categoría • Activa • Categoría • Activa • Categoría • "
            id={category.id}
            x="40%"
            y="-40%"
            scale={1}
            duration={50}
          />
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="flex-shrink-0">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-16 h-16 border-2 rounded-lg border-dark-sm"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23e0e0e0' width='64' height='64'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='24'%3E%3F%3C/text%3E%3C/svg%3E"
                  }}
                />
              ) : (
                <div className={`flex items-center rounded-lg justify-center w-16 h-16 border-2 border-dark-sm ${
                  category.isActive ? 'bg-primary-sm' : 'bg-secondary-sm'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-light-sm size-8">
                    <path d="M3.196 12.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 12.87z" />
                    <path d="M3.196 8.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 8.87z" />
                    <path d="M10.38 1.103a.75.75 0 00-.76 0l-7.25 4.25a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.76 0l7.25-4.25a.75.75 0 000-1.294l-7.25-4.25z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 ml-5">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold uppercase truncate text-dark-sm">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="mt-1 text-sm text-grey-sm line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs font-medium uppercase text-grey-sm">
                    Orden: {category.sortOrder}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <BrutalToggle
                isActive={category.isActive}
                onToggle={() => onToggleActive(category.id)}
                disabled={actionLoading === category.id}
                size="sm"
              />
              <BrutalButton
                onClick={() => onDelete(category.id, category.name)}
                disabled={actionLoading === category.id}
                variant="neutral"
                size="sm"
                icon
                title="Eliminar categoría"
              >
                <Trash className="w-4 h-4" />
              </BrutalButton>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 border-dark-sm bg-light-sm">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium uppercase text-grey-sm">
            Creado:{" "}
            {new Date(category.createdAt).toLocaleDateString("es-ES")}
          </div>
          <div className="flex gap-2">
            <BrutalButtonLink
              href={`/admin/categories/${category.id}`}
              variant="primary"
              size="xs"
            >
              Ver/Editar →
            </BrutalButtonLink>
          </div>
        </div>
      </div>
    </div>
  )
}
