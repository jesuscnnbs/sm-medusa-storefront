"use client"
import * as React from "react"
import Image from "next/image"
import PageTitle from "@modules/common/components/page-title"
import backgroundFadeIn from "../../../../../public/burger3.jpeg"
import CallToActionButton from "@modules/common/components/call-to-action-button"
import Link from "next/link"

const Hero = () => {
  return (
    <div className="min-h-[600px] h-[80vh] w-full border-b border-ui-border-base relative overflow-hidden bg-secondary-sm">
      <Image
        src={backgroundFadeIn.src}
        alt="Santa Mónica Burger"
        loading="lazy"
        fill={true}
        objectFit="cover"
        className="transition-opacity duration-1000 opacity-0 blur-[2px]"
        onLoadingComplete={(image) => image.classList.replace("opacity-0", "opacity-30")}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 gap-7">
        <div className="flex flex-col items-start gap-2">
          <h1 className="santa-monica">
            <PageTitle text="Santa" />
            <PageTitle text="Mónica" classNames="monica" initialDelay={250}/>
          </h1>
        </div>
        <div className="z-10 opacity-0 delay-800 animate-fade-in-bottom">
          <Link href="https://restaurante.covermanager.com/santa-monica/">
            <CallToActionButton />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Hero
