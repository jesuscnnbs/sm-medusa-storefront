"use client"
import * as React from "react"
import Image from "next/image"
import { Variants } from "framer-motion"
import { Button } from "@medusajs/ui"
import AnimatedComponent from "@modules/common/components/animated-component"
import PageTitle from "@modules/common/components/page-title"
import lighthouse from "../../../../../public/lighthouse.jpeg"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { MenuItems } from "@modules/layout/templates/nav"
import Link from "next/link"

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
    <div className="min-h-[80vh] w-full border-b border-ui-border-base relative overflow-hidden bg-secondary-sm">
      <Image
        src={lighthouse}
        alt="Santa Mónica Lighthouse"
        loading="lazy"
        fill={true}
        objectFit="cover"
        className="transition-opacity duration-1000 opacity-0 blur-[2px]"
        onLoadingComplete={(image) => image.classList.replace("opacity-0", "opacity-30")}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-4">
        <div className="flex flex-col items-start gap-2">
          <h1 className="santa-monica">
            <PageTitle text="Santa" />
            <PageTitle text="Mónica" classNames="monica" initialDelay={250}/>
          </h1>
        </div>
        <AnimatedComponent variant={fadeUpVariant3}>
          <div className="flex flex-col gap-4 md:flex-row">
            <Link href="https://restaurante.covermanager.com/santa-monica/" className="btn-smonica btn-primary-sm">Reserva</Link>
            <LocalizedClientLink href={MenuItems.Store} className="btn-smonica btn-secondary-sm">Store</LocalizedClientLink>
          </div>
        </AnimatedComponent>
      </div>
    </div>
  )
}

export default Hero
