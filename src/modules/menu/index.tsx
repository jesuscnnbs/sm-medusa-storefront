"use client"
import React from "react"
import { Heading, Text } from "@medusajs/ui"
import Image from "next/image"
import { menu } from "./menu"
import Modal from "@modules/common/components/modal"
import img from "../../../public/emmy.jpg"
import { InformationCircleSolid } from "@medusajs/icons"
import { MenuCategoryType } from "types/global"

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
    setTimeout(() => setItemSelected(null), 201)
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
                      {/**<Image
                          src={img}
                          alt={item["name"]}
                          width={200}
                          height={200}
                        />*/}
                      <Heading
                        level="h3"
                        className="uppercase flex-0 line-clamp-1 text-md min-w-40 sm:min-w-fit text-ui-fg-subtle"
                      >
                        {item["title"]}
                      </Heading>
                      <div className="hidden w-full mx-2 border-b-2 border-dotted small:block border-ui-fg-subtle opacity-40"></div>
                      <Text className="font-bold line-clamp-1 min-w-fit text-secondary-sm-darker">
                        14.95 €
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
            <Image
              src={img}
              alt={itemSelected["title"]}
              width={200}
              height={200}
            />
            <Heading level="h3">{itemSelected["title"]}</Heading>
            <Text>{itemSelected["description"]}</Text>
          </React.Fragment>
        )}
      </Modal>
    </div>
  )
}

export default Menu
