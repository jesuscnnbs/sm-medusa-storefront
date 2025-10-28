"use client"
import React from "react"
import { Heading, Text } from "@medusajs/ui"
import Image from "next/image"
import Modal from "@modules/common/components/modal"
import { InformationCircleSolid } from "@medusajs/icons"
import { MenuCategoryType } from "types/global"

interface Props {
  menuItems: MenuCategoryType[]
}

const Menu = ({menuItems}: Props) => {
  const [itemSelected, setItemSelected] = React.useState<any>(null)
  const [modalOpen, setModalOpen] = React.useState<boolean>(false)

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleOpen = (item: any) => {
    // Clear any existing timeout to prevent race conditions
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setItemSelected(item)
    setModalOpen(true)
  }
  const handleClose = () => {
    setModalOpen(false)
    // Add delay to prevent empty modal content during the animation
    timeoutRef.current = setTimeout(() => {
      setItemSelected(null)
    }, 500)
  }
  return (
    <div className="max-w-2xl px-6 py-12 mx-auto border-2 rounded-lg bg-light-sm-lighter border-dark-sm">
      {menuItems.map((category, index) => {
        return (
          <div className="mb-16" key={index}>
            <h2
              key={index}
              className="text-3xl uppercase font-lemonMilk text-secondary-sm-darker"
            >
              {category.title}
            </h2>
            <div className="w-full">
              {category.items &&
                category.items.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="flex justify-between p-2 mt-2 cursor-pointer sm:mt-0 rounded-xl sm:rounded-none"
                      onClick={() => handleOpen(item)}
                    >
                    {/*<div
                      key={i}
                      className="flex justify-between p-4 mt-2 border-2 cursor-pointer sm:mt-0 rounded-xl sm:rounded-none sm:p-2 sm:border-none border-secondary-sm-darker bg-light-sm-lighter shadow-drop sm:drop-shadow-none"
                      onClick={() => handleOpen(item)}
                    >*/}
                    
                      <Heading
                        level="h3"
                        className="flex-0 line-clamp-1 text-md min-w-40 sm:min-w-fit text-dark-sm-lighter"
                      >
                        {item["title"]}
                      </Heading>
                      <div className="hidden w-full mx-2 border-b-2 border-dotted sm:block border-ui-fg-subtle opacity-40"></div>
                      <Text className="font-bold line-clamp-1 min-w-fit text-secondary-sm-darker">
                        {(item.price / 100).toFixed(2)} €
                        <InformationCircleSolid className="inline-block ml-2 sm:hidden" />
                      </Text>
                    </div>
                  )
                })}
            </div>
          </div>
        )
      })}
      <Modal isOpen={modalOpen} close={handleClose} size="large">
        <Modal.Title> 
          <Heading level="h3" className="text-xl font-bold">
            {itemSelected?.title || ""}
          </Heading>
        </Modal.Title>
        {itemSelected && (
          <React.Fragment>
            <div className="p-3 sm:p-5">
              {itemSelected.image && (
                <div className="flex justify-center mb-4">
                  <div className="relative w-full max-w-sm overflow-hidden rounded-lg aspect-square max-h-[50vh]">
                    <Image
                      src={itemSelected.image}
                      alt={itemSelected.title}
                      fill
                      className="object-cover w-full h-full border rounded-lg border-secondary-sm-darker"
                      sizes="(max-width: 768px) 90vw, 384px"
                      priority
                    />
                  </div>
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <Text className="text-lg font-bold text-secondary-sm-darker">
                  {(itemSelected.price / 100).toFixed(2)} €
                </Text>
              </div>
              <Text className="mb-4 text-gray-600">
                {itemSelected.description}
              </Text>
              
              {itemSelected.ingredients && itemSelected.ingredients.length > 0 && (
                <div className="mb-3">
                  <Text className="mb-2 font-semibold">Ingredientes:</Text>
                  <Text className="text-sm text-gray-600">
                    {itemSelected.ingredients}
                  </Text>
                </div>
              )}
              
              {itemSelected.allergens && itemSelected.allergens.length > 0 && (
                <div className="mb-3">
                  <Text className="mb-2 font-semibold text-orange-600">Alérgenos:</Text>
                  <Text className="text-sm text-orange-600">
                    {itemSelected.allergens.join(', ')}
                  </Text>
                </div>
              )}
            </div>
          </React.Fragment>
        )}
      </Modal>
    </div>
  )
}

export default Menu
