"use client"
import { memo } from "react"
import Image from "next/image"
import ParallaxTitle from "@modules/common/components/parallax-title"
import picture from "../../../../../public/team.jpg"
import { Translations } from "types/global"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"
import { useImageFadeIn } from "@lib/hooks"

interface StoryProps {
  translations: Translations
}

const Story = memo(({translations}: StoryProps) => {
  const { imageRef, handleImageLoad } = useImageFadeIn()

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
          className="-mt-5 transition-opacity duration-500 border-2 rounded-lg opacity-0 border-dark-sm"
          onLoad={handleImageLoad}
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
})

Story.displayName = "Story"

export default Story
