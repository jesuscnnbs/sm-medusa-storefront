"use client"

import React from "react"
import { Trash } from "@medusajs/icons"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"
import { CircularText } from "@modules/admin/components/circular-text"
import { BrutalToggle } from "@modules/admin/components/brutal-toggle"
import { twMerge } from "tailwind-merge"
import BrutalButton from "../brutal-button"
import Image from "next/image"

interface DishCardProps {
  dish: {
    id: string
    name: string
    description?: string
    isAvailable: boolean
    isPopular?: boolean
    price: number
    image?: string | null
    sortOrder: number
    createdAt: Date | string
    category?: {
      name: string
    }
  }
  actionLoading: string | null
  onToggleAvailability: (id: string) => void
  onDelete: (id: string, name: string) => void
}

export const DishCard = ({
  dish,
  actionLoading,
  onToggleAvailability,
  onDelete,
}: DishCardProps) => {
  return (
    <div className="overflow-hidden border-2 rounded-lg border-dark-sm bg-light-sm-lighter">
      <div className="p-4 overflow-hidden">
        {dish.isPopular && (
          <CircularText
            text="Popular • Destacado • Popular • Destacado • Popular • "
            id={dish.id}
            x="40%"
            y="-40%"
            scale={1}
            duration={50}
          />
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="flex-shrink-0">
              {dish.image ? (
                <Image
                  src={dish.image}
                  alt={dish.name || 'Plato'}
                  width={64}
                  height={64}
                  className="object-cover w-16 h-16 border-2 rounded-lg border-dark-sm"
                />
              ) : (
                <div className="flex items-center justify-center w-16 h-16 border-2 rounded-lg border-dark-sm bg-grey-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-light-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 ml-5">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold uppercase truncate text-dark-sm">
                    {dish.name}
                  </h3>
                  {dish.category && (
                    <p className="text-sm font-medium uppercase text-primary-sm">
                      {dish.category.name}
                    </p>
                  )}
                  {dish.description && (
                    <p className="mt-1 text-sm text-grey-sm line-clamp-2">
                      {dish.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-lg font-bold text-dark-sm">
                      ${(dish.price / 100).toFixed(2)}
                    </p>
                    {dish.isPopular && (
                      <span className="inline-flex items-center px-2 py-0.5 border-2 text-xs font-bold uppercase bg-yellow-100 text-yellow-800 border-yellow-800">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <BrutalToggle
                isActive={dish.isAvailable}
                onToggle={() => onToggleAvailability(dish.id)}
                disabled={actionLoading === dish.id}
                size="sm"
              />
              <BrutalButton
                onClick={() => onDelete(dish.id, dish.name)}
                disabled={actionLoading === dish.id}
                variant="neutral"
                size="sm"
                icon
                title="Eliminar plato"
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
            {new Date(dish.createdAt).toLocaleDateString("es-ES")}
          </div>
          <div className="flex gap-2">
            <BrutalButtonLink
              href={`/admin/dish/${dish.id}`}
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
