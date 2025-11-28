"use client"

import { useState, useEffect } from "react"
import { getMenuItemById } from "@lib/db/queries"
import DishForm from "@modules/admin/components/dish-form"
import { notFound } from "next/navigation"
import { useParams } from "@lib/hooks"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"
import { BarLoader } from "@modules/admin/components/bar-loader"

interface DishEditProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default function DishEditPage({ params }: DishEditProps) {
  const resolvedParams = useParams(params)
  const [dish, setDish] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (resolvedParams?.id) {
      loadDish()
    }
  }, [resolvedParams?.id])

  const loadDish = async () => {
    if (!resolvedParams?.id) return

    try {
      const data = await getMenuItemById(resolvedParams.id)
      if (!data) {
        notFound()
      }
      setDish(data)
    } catch (error) {
      console.error("Error loading dish:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !resolvedParams) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BarLoader />
      </div>
    )
  }

  if (!dish) {
    return notFound()
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <BrutalButtonLink
            href="/admin/dish"
            variant="neutral"
            size="sm"
          >
            ← Volver a Platos
          </BrutalButtonLink>
        </div>
      </div>

      <DishForm mode="edit" initialData={dish} />
    </>
  )
}
