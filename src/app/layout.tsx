import { getBaseURL } from "@lib/util/env"
import localFont from "next/font/local"
import { Metadata } from "next"
import "styles/globals.css"
import noise from "../../public/black-noise.png"

const lemonMilkRegular = localFont({
  src: "../fonts/LemonMilkRegular.otf",
  variable: "--font-lemon-milk",
  weight: "300 400",
});

const lemonMilkMedium = localFont({
  src: "../fonts/LemonMilkMedium.otf",
  variable: "--font-lemon-milk-medium",
  weight: "500 600",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className={`${lemonMilkRegular.variable} ${lemonMilkMedium.variable} antialiased`}>
      
        <main className="relative">
        <div
          style={{
            backgroundImage:
              `url(${noise.src})`,
          }}
          className="pointer-events-none fixed h-full w-full opacity-[3%] z-[999999]"
        >
        </div>
          {props.children}
        </main>
      </body>
    </html>
  )
}
