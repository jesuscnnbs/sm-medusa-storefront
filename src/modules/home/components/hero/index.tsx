import { Button, Heading, Text } from "@medusajs/ui"
import SantaMonicaIcon from "modules/common/icons/santa-monica"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative">
      <div className="absolute inset-0 z-10 flex flex-col items-start justify-center gap-6 p-10 small:p-32">
        <div className="flex flex-col items-center gap-2">
          <SantaMonicaIcon size="250"/>
          <Heading
            level="h1"
            className="text-center uppercase font-lemonMilk text-secondary-sm"
          >
            <span className="text-3xl md:text-7xl">Santa</span> <br/> <span className="text-2xl md:text-[3.5rem] leading-[1.1]">Mónica</span>
          </Heading>
        <Text className="font-sans text-md md:text-lg">El sabor inigualable de la carne a la parrilla.</Text>
        </div>
        <div className="flex gap-2">
        <Button variant="secondary">Reserva tu mesa</Button>
        <Button>Nuestra tienda</Button>
        </div>
      </div>
    </div>
  )
}

export default Hero
