"use client"
import React from "react"
import Image from "next/image"
import Iframe from 'react-iframe'
import PageTitle from "@modules/common/components/page-title"
import backgroundFadeIn from "../../../../../../public/girl-drink.jpeg"

export default function Reserve() {
  return (
    <React.Fragment>
      <section className="relative py-40 bg-secondary-sm-darker">
      <Image
        src={backgroundFadeIn.src}
        alt="Background Image"
        loading="lazy"
        fill={true}
        objectFit="cover"
        className="transition-opacity duration-1000 opacity-0 blur-[2px]"
        onLoadingComplete={(image) => image.classList.replace("opacity-0", "opacity-30")}
      />
      <div className="flex flex-col items-center justify-center px-2 pb-10">
        <h1 className="santa-monica monica">
          <PageTitle text="Reservar" />
        </h1>
      </div>
      {/* TODO: Add a loading state and change the url locale*/} 
      <Iframe url="https://www.covermanager.com/reserve/module_restaurant/restaurante-santamonica-gourmet/spanish"
        width="100%"
        height="900px"
        id=""
        className="max-w-[740px] min-w-[290px] mx-auto rounded-lg bg-light-sm-lighter"
        display="block"
        position="relative"
      />
    </section>
    </React.Fragment>
  )
}
