import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '../../i18n/routing';
import noise from "../../../public/black-noise.png"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const lemonMilkRegular = localFont({
  src: "../../fonts/LemonMilkRegular.otf",
  variable: "--font-lemon-milk",
  weight: "300 400",
});

const lemonMilkMedium = localFont({
  src: "../../fonts/LemonMilkMedium.otf",
  variable: "--font-lemon-milk-medium",
  weight: "500 600",
})

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Await the params object in Next.js 15
  const {locale} = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  console.log("Layout - Countrycode - locale: ",locale)
  setRequestLocale(locale)
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
    return (
    <html lang={locale} data-mode="light">
      <body className={`${lemonMilkRegular.variable} ${lemonMilkMedium.variable} antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <main className="relative">
            <div
              style={{
                backgroundImage: `url(${noise.src})`,
              }}
              className="pointer-events-none fixed h-full w-full opacity-5 z-[999999]"
            >
            </div>
            {children}
          </main>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}