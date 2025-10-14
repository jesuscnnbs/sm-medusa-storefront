"use client"

import { useState, useEffect } from "react"
import { getAllMenuItems } from "@lib/db/queries"

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
      <div className="p-6 border border-gray-200 rounded-lg">
        <div className="text-center text-grey-sm">Cargando platos...</div>
      </div>
    )
  }

  return (
    <div className="p-6 border border-gray-200 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-dark-sm mb-2">
          Seleccionar Platos del Menú
        </h3>
        <p className="text-sm text-grey-sm mb-4">
          {selectedCount} plato{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
        </p>
        
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar platos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-sm focus:border-transparent"
          />
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
          >
            Seleccionar todos ({filteredItems.length})
          </button>
          <button
            type="button"
            onClick={handleDeselectAll}
            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Deseleccionar filtrados
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <p className="text-centre text-grey-sm py-4">
            {searchTerm ? 'No se encontraron platos' : 'No hay platos disponibles'}
          </p>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => {
              const isSelected = selectedItemIds.includes(item.id)
              const displayName = locale === 'en' ? (item.nameEn || item.name) : item.name
              const displayDescription = locale === 'en' ? (item.descriptionEn || item.description) : item.description
              const categoryName = locale === 'en' 
                ? (item.category?.nameEn || item.category?.name || 'Sin categoría') 
                : (item.category?.name || 'Sin categoría')

              return (
                <div
                  key={item.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-primary-sm-lighter border-primary-sm' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleToggleItem(item.id)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleItem(item.id)}
                    className="mr-3 w-4 h-4 text-primary-sm bg-gray-100 border-gray-300 rounded focus:ring-primary-sm focus:ring-2"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-dark-sm truncate">
                        {displayName}
                      </h4>
                      <span className="text-sm font-medium text-dark-sm ml-2">
                        ${(item.price / 100).toFixed(2)}
                      </span>
                    </div>
                    
                    {displayDescription && (
                      <p className="text-xs text-grey-sm mt-1 line-clamp-2">
                        {displayDescription}
                      </p>
                    )}
                    
                    <p className="text-xs text-primary-sm mt-1">
                      {categoryName}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}