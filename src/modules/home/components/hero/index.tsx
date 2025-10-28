"use client"
import { memo } from "react"
import Image from "next/image"
import PageTitle from "@modules/common/components/page-title"
import backgroundFadeIn from "../../../../../public/burger3.jpeg"
import CallToActionButton from "@modules/common/components/call-to-action-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useImageFadeIn } from "@lib/hooks"

const Hero = memo(({translation}: {translation: string}) => {
  const { imageRef, handleImageLoad } = useImageFadeIn("opacity-0", "opacity-20")
  return (
    <div className="min-h-[650px] h-[80vh] w-full border-b border-ui-border-base relative overflow-hidden bg-secondary-sm">
      <Image
        ref={imageRef}
        src={backgroundFadeIn.src}
        alt="Santa Mónica Burger"
        priority
        fill={true}
        objectFit="cover"
        className="transition-opacity duration-1000 opacity-0 blur-[2px]"
        onLoad={handleImageLoad}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 gap-7">
        <div className="flex flex-col items-start gap-2">
          <h1 className="santa-monica font-lemonMilk">
            <PageTitle text="Santa" />
            <PageTitle text="Mónica" classNames="monica" initialDelay={250}/>
          </h1>
        </div>
        <div className="absolute z-10 opacity-0 bottom-16 right-10 delay-800 animate-fade-in-bottom">
          <LocalizedClientLink href="/reserve">
            <CallToActionButton text={translation}/>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
})

Hero.displayName = "Hero"

export default Hero
