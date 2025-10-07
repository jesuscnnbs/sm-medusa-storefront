"use client"
import React from "react"
import { Heading, Text } from "@medusajs/ui"
import Image from "next/image"
import { menu } from "./menu"
import Modal from "@modules/common/components/modal"
import { InformationCircleSolid } from "@medusajs/icons"
import { MenuCategoryType } from "types/global"
import { convertGoogleDriveUrl, isValidImageUrl } from "@lib/utils/image-utils"

interface Props {
  menuItems: MenuCategoryType[]
}

const Menu = ({menuItems}: Props) => {
  const [itemSelected, setItemSelected] = React.useState<any>(null)
  const [modalOpen, setModalOpen] = React.useState<boolean>(false)

  const handleOpen = (item: any) => {
    setItemSelected(item)
    setModalOpen(true)
  }
  const handleClose = () => {
    setModalOpen(false)
    // Add small delay to prevent flicker
    setTimeout(() => {
      setItemSelected(null)
    }, 200)
  }
  return (
    <div className="max-w-2xl px-6 py-12 mx-auto bg-ui-bg-base">
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
                      className="flex justify-between p-4 mt-2 border rounded-full cursor-pointer small:p-2 small:border-none border-secondary-sm"
                      onClick={() => handleOpen(item)}
                    >
                      <Heading
                        level="h3"
                        className="uppercase flex-0 line-clamp-1 text-md min-w-40 sm:min-w-fit text-ui-fg-subtle"
                      >
                        {item["title"]}
                      </Heading>
                      <div className="hidden w-full mx-2 border-b-2 border-dotted small:block border-ui-fg-subtle opacity-40"></div>
                      <Text className="font-bold line-clamp-1 min-w-fit text-secondary-sm-darker">
                        {(item.price / 100).toFixed(2)} €
                        <InformationCircleSolid className="inline-block ml-2 small:hidden" />
                      </Text>
                    </div>
                  )
                })}
            </div>
          </div>
        )
      })}
      <Modal isOpen={modalOpen} close={handleClose} size="large">
        {itemSelected && (
          <React.Fragment>
            <div className="p-6">
              {itemSelected.image && isValidImageUrl(itemSelected.image) && (
                <div className="mb-4 text-center">
                  <div className="relative mx-auto overflow-hidden rounded-lg w-80 h-60">
                    <Image
                      src={convertGoogleDriveUrl(itemSelected.image)}
                      alt={itemSelected.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 320px"
                      priority
                    />
                  </div>
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <Heading level="h3" className="text-xl font-bold">
                  {itemSelected.title}
                </Heading>
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
