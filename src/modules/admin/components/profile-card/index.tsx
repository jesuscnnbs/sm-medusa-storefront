"use client"

import React from "react"
import { Trash } from "@medusajs/icons"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"
import { CircularText } from "@modules/admin/components/circular-text"
import { BrutalToggle } from "@modules/admin/components/brutal-toggle"
import { twMerge } from "tailwind-merge"
import BrutalButton from "../brutal-button"

interface ProfileCardProps {
  profile: {
    id: string
    name: string
    description?: string
    isActive: boolean
    createdAt: Date | string
  }
  actionLoading: string | null
  onToggleActive: (id: string) => void
  onDelete: (id: string, name: string) => void
}

export const ProfileCard = ({
  profile,
  actionLoading,
  onToggleActive,
  onDelete,
}: ProfileCardProps) => {
  return (
    <div className="overflow-hidden border-2 rounded-lg border-dark-sm bg-light-sm-lighter">
      <div className="p-4 overflow-hidden">
        {profile.isActive && (
          <CircularText
            text="Menú • Activo • Menú • Activo • Menú • Activo • Menú • "
            id={profile.id}
            x="40%"
            y="-40%"
            scale={1}
            duration={50}
          />
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="flex-1 ml-5">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold uppercase truncate text-dark-sm">
                    {profile.name}
                  </h3>
                  {profile.description && (
                    <p className="mt-1 text-sm text-grey-sm line-clamp-2">
                      {profile.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <BrutalToggle
                isActive={profile.isActive}
                onToggle={() => onToggleActive(profile.id)}
                disabled={actionLoading === profile.id}
                size="sm"
              />
              <BrutalButton
                onClick={() => onDelete(profile.id, profile.name)}
                disabled={actionLoading === profile.id}
                variant="neutral"
                size="sm"
                icon
                title="Eliminar menú"
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
            {new Date(profile.createdAt).toLocaleDateString("es-ES")}
          </div>
          <div className="flex gap-2">
            <BrutalButtonLink
              href={`/admin/menu/${profile.id}`}
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
