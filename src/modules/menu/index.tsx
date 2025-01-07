"use client"
import React from "react"
import { Heading, Text } from "@medusajs/ui"
import Image from "next/image"
import { menu } from "./menu"
import img from "../../../public/emmy.jpg"

const Menu = () => {
  const [itemSelected, setItemSelected] = React.useState<any>(null)
  const showItem = (item: any) => {
    setItemSelected(item)
  }
  return (
    <div className="max-w-2xl px-6 py-12 mx-auto bg-ui-bg-base">
      {menu.map((category, index) => {
        return (
          <div className="mb-16">
            <Heading
              level="h2"
              key={index}
              className="text-2xl uppercase font-lemonMilk text-secondary-sm-darker"
            >
              {category.title}
            </Heading>
            <div className="w-full">
              {category.items &&
                category.items.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="flex mt-2 md:mt-4"
                      onClick={() => showItem(item)}
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
                        {item["name"]}
                      </Heading>
                      <div className="w-full mx-2 border-b-2 border-dotted border-ui-fg-subtle opacity-40"></div>
                      <Text className="font-bold line-clamp-1 min-w-fit text-secondary-sm-darker">
                        14.95 €
                      </Text>
                    </div>
                  )
                })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Menu
