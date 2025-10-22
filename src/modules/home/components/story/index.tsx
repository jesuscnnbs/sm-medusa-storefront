"use client"
import { useRef } from "react"
import Image from "next/image"
import ParallaxTitle from "@modules/common/components/parallax-title"
import picture from "../../../../../public/sm-burgers-home.jpg"
import { Translations } from "types/global"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"

interface StoryProps {
  translations: Translations
}


function Story({translations}: StoryProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  
  return (
    <section className="pb-20 bg-light-sm">
      <ParallaxTitle
        textPrimary={translations.parallaxOne}
        textSecondary={translations.parallaxTwo}
        className="-rotate-1"
      />
      <div className="max-w-5xl px-4 mx-auto">
        <Image
          ref={imageRef}
          src={picture.src}
          alt="Santa Mónica"
          loading="lazy"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          className="-mt-5 transition-opacity duration-500 border-2 rounded-none opacity-0 border-dark-sm"
          onLoad={() => {
            if (imageRef.current) {
              imageRef.current.classList.replace("opacity-0", "opacity-100")
            }
          }}
        />
        <p className="mt-10 text-lg text-dark-sm">
          {translations.description}
        </p>
      </div>
      <div className="flex justify-center mt-10">
        <BrutalButtonLink href="/about" data-testid="about-link" variant="secondary">
            {translations.learnMore}
        </BrutalButtonLink>
      </div>
    </section>
  )
}

export default Story
