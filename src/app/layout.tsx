import { getBaseURL } from "@lib/util/env"
import localFont from "next/font/local"
import { Metadata } from "next"
import "styles/globals.css"

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
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
