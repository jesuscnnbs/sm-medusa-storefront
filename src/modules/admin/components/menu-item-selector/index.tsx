"use client"

import { useState, useEffect } from "react"
import { getAllMenuItems } from "@lib/db/queries"
import BrutalButton from "../brutal-button"
import { BrutalInput, BrutalFormContainer } from "../brutal-form"
import { BarLoader } from "@modules/admin/components/bar-loader"

interface MenuItem {
  id: string
  name: string
  nameEn?: string
  description?: string
  descriptionEn?: string
  price: number
  image?: string
  category?: {
    id: string
    name: string
    nameEn?: string
  }
}

interface MenuItemSelectorProps {
  selectedItemIds: string[]
  onSelectionChange: (selectedIds: string[]) => void
  locale?: 'en' | 'es'
}

export default function MenuItemSelector({ 
  selectedItemIds, 
  onSelectionChange,
  locale = 'es'
}: MenuItemSelectorProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadMenuItems()
  }, [])

  const loadMenuItems = async () => {
    try {
      const items = await getAllMenuItems()
      setMenuItems(items)
    } catch (error) {
      console.error("Error loading menu items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleItem = (itemId: string) => {
    const newSelection = selectedItemIds.includes(itemId)
      ? selectedItemIds.filter(id => id !== itemId)
      : [...selectedItemIds, itemId]
    
    onSelectionChange(newSelection)
  }

  const handleSelectAll = () => {
    const filteredItems = getFilteredItems()
    const allFilteredIds = filteredItems.map(item => item.id)
    const newSelection = [...new Set([...selectedItemIds, ...allFilteredIds])]
    onSelectionChange(newSelection)
  }

  const handleDeselectAll = () => {
    const filteredItems = getFilteredItems()
    const filteredIds = filteredItems.map(item => item.id)
    const newSelection = selectedItemIds.filter(id => !filteredIds.includes(id))
    onSelectionChange(newSelection)
  }

  const getFilteredItems = () => {
    if (!searchTerm) return menuItems
    
    return menuItems.filter(item => {
      const name = locale === 'en' ? (item.nameEn || item.name) : item.name
      const description = locale === 'en' ? (item.descriptionEn || item.description) : item.description
      const categoryName = locale === 'en' 
        ? (item.category?.nameEn || item.category?.name || '') 
        : (item.category?.name || '')
      
      const searchLower = searchTerm.toLowerCase()
      return (
        name.toLowerCase().includes(searchLower) ||
        (description || '').toLowerCase().includes(searchLower) ||
        categoryName.toLowerCase().includes(searchLower)
      )
    })
  }

  const filteredItems = getFilteredItems()
  const selectedCount = selectedItemIds.length

  if (loading) {
    return (
      <BrutalFormContainer>
        <BarLoader />
      </BrutalFormContainer>
    )
  }

  return (
    <BrutalFormContainer>
      {/* Header */}
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-bold uppercase text-dark-sm">
          Seleccionar Platos del Menú
        </h3>
        <p className="mb-4 text-sm font-medium text-grey-sm">
          {selectedCount} plato{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
        </p>

        {/* Search */}
        <div className="mb-4">
          <BrutalInput
            type="text"
            placeholder="Buscar platos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-2">
          <BrutalButton
            type="button"
            onClick={handleSelectAll}
            variant="primary"
            size="sm"
          >
            Seleccionar todos ({filteredItems.length})
          </BrutalButton>
          <BrutalButton
            type="button"
            onClick={handleDeselectAll}
            variant="secondary"
            size="sm"
          >
            Deseleccionar filtrados
          </BrutalButton>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filteredItems.length === 0 ? (
          <p className="py-8 font-bold text-center uppercase text-grey-sm">
            {searchTerm ? 'No se encontraron platos' : 'No hay platos disponibles'}
          </p>
        ) : (
          <div className="overflow-hidden border-2 border-dark-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-sm text-light-sm">
                  <th className="w-12 px-3 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={filteredItems.every(item => selectedItemIds.includes(item.id))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleSelectAll()
                        } else {
                          handleDeselectAll()
                        }
                      }}
                      className="w-5 h-5 border-2 border-light-sm accent-primary-sm"
                    />
                  </th>
                  <th className="px-3 py-3 text-xs font-black text-left uppercase">Nombre</th>
                  <th className="px-3 py-3 text-xs font-black text-left uppercase">Categoría</th>
                  <th className="px-3 py-3 text-xs font-black text-right uppercase">Precio</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => {
                  const isSelected = selectedItemIds.includes(item.id)
                  const displayName = locale === 'en' ? (item.nameEn || item.name) : item.name
                  const displayDescription = locale === 'en' ? (item.descriptionEn || item.description) : item.description
                  const categoryName = locale === 'en'
                    ? (item.category?.nameEn || item.category?.name || 'Sin categoría')
                    : (item.category?.name || 'Sin categoría')

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleToggleItem(item.id)}
                      className={`border-t-2 border-dark-sm cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-primary-sm-lighter'
                          : index % 2 === 0 ? 'bg-light-sm' : 'bg-light-sm-lighter hover:bg-primary-sm-lighter/30'
                      }`}
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleItem(item.id)}
                          className="w-5 h-5 border-2 border-dark-sm accent-primary-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-bold text-dark-sm">{displayName}</div>
                        {displayDescription && (
                          <div className="mt-1 text-xs text-grey-sm line-clamp-1">
                            {displayDescription}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-sm font-medium text-dark-sm">{categoryName}</span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="font-bold text-dark-sm">
                          ${(item.price / 100).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </BrutalFormContainer>
  )
}