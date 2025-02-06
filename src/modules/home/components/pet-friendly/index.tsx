"use client"
import Image from "next/image"
import ParallaxTitle from "@modules/common/components/parallax-title"
import picture from "../../../../../public/pet-friendly-dog.jpeg"

function PetFriendly() {
  return (
    <section className="relative pt-[400px] pb-[100px] bg-secondary-sm">
       <Image
          src={picture.src}
          alt="Santa Mónica Burger"
          loading="lazy"
          fill={true}
          objectFit="cover"
          className="transition-opacity duration-1000 opacity-0"
          onLoadingComplete={(image) => image.classList.replace("opacity-0", "opacity-30")}
        />
      <ParallaxTitle
        textPrimary="FRIENDLY 🐾"
        textSecondary="PET"
        className="rotate-1"
      />
    </section>
  )
}

export default PetFriendly
