"use client"
import * as React from "react"
import Image from "next/image"
import { Variants } from "framer-motion"
import { Button } from "@medusajs/ui"
import AnimatedComponent from "@modules/common/components/animated-component"
import PageTitle from "@modules/common/components/page-title"
import lighthouse from "../../../../../public/lighthouse.jpeg"


const fadeUpVariant3: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: 0.7,
    },
  },
}

const Hero = () => {
  return (
    <div className="h-[80vh] w-full border-b border-ui-border-base relative overflow-hidden bg-secondary-sm">
      <Image
        src={lighthouse}
        alt="Santa Mónica Lighthouse"
        loading="lazy"
        fill={true}
        objectFit="cover"
        className="transition-opacity duration-1000 opacity-0"
        onLoadingComplete={(image) => image.classList.replace("opacity-0", "opacity-30")}
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 p-4">
        <div className="flex flex-col items-start gap-2">
          <h1 className="santa-monica">
            <PageTitle text="Santa" />
            <PageTitle text="Mónica" classNames="monica" initialDelay={250}/>
          </h1>
        </div>
        <AnimatedComponent variant={fadeUpVariant3}>
          <div className="flex gap-2">
            <button className="btn-smonica btn-primary-sm">Reserva ya</button>
            <button className="btn-smonica btn-primary-sm">Ir a la tienda</button>
          </div>
        </AnimatedComponent>
      </div>
    </div>
  )
}

export default Hero
