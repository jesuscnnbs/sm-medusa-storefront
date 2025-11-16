import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import SantaMonicaIcon from "@modules/common/icons/santa-monica"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default async function NotFound({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  return (
    <html lang="es" data-mode="light">
      <body className="bg-light-sm">
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4">
          {/* Icon */}
          <div className="absolute transform opacity-50 top-8 -z-10">
            <SantaMonicaIcon size={620} />
          </div>

          {/* 404 Box */}
          <div className="w-full max-w-lg p-16 border-4 rounded-lg bg-opacity-35 border-dark-sm bg-light-sm-lighter shadow-brutal-primary">
            <div className="space-y-0 text-center">
              {/* 404 Number */}
              <h1 className="font-black leading-none text-8xl text-primary-sm font-lemonMilk">
                404
              </h1>

              {/* Title */}
              <h2 className="text-2xl font-bold tracking-tight uppercase text-dark-sm">
                ¡Página no encontrada!
              </h2>

              {/* Description */}
              <p className="text-base font-medium text-dark-sm/80">
                ¿Es esto lo que estabas buscando?
              </p>

              <Image 
                src="/cute-cat-burger.gif"
                alt="Cute Cat Burger"
                width={200}
                height={200}
                className="mx-auto"
              />

              {/* Button */}
              <Link
                href="/"
                className="inline-block px-8 py-3 mt-4 font-bold tracking-wide uppercase transition-all duration-150 border-2 rounded-md bg-secondary-sm border-dark-sm text-light-sm shadow-brutal-primary active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Volver al inicio
              </Link>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-sm font-medium text-dark-sm/60">
            Error 404 - Page not found
          </p>
        </div>
      </body>
    </html>
  )
}
