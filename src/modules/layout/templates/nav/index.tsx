import { Button } from "@medusajs/ui"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
//import CartButton from "@modules/layout/components/cart-button"
//import { Suspense } from "react"
import SideMenu from "@modules/layout/components/side-menu"
import SantaMonicaIcon from "@modules/common/icons/santa-monica"
import Link from "next/link"
import Instagram from "@modules/common/icons/instagram"
import LanguageSelect from "@modules/layout/components/language-select";

export const MenuItems = {
  Home: "/",
  About: "/about",
  Menu: "/menu",
  Store: "/store",
}

const SideMenuItems = {
  ...MenuItems,
  Account: "/account",
  Cart: "/cart",
}

const HomeIconLink = () => {
  return (
    <LocalizedClientLink href="/" data-testid="nav-home-link" className="flex items-center">
      <SantaMonicaIcon size={40} />
      <span className="mt-[2px] hidden mx-2 text-[22px] font-medium uppercase align-middle small:block text-secondary-sm font-lemonMilk">Santa<br/><span className="text-[17px]">Mónica</span></span>
    </LocalizedClientLink>
  )
}

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  return (
    <div className="sticky inset-x-0 top-0 z-30 shadow-2xl group">
      <header className="relative h-16 mx-auto duration-200 border-b bg-ui-bg-base border-ui-tag-neutral-border">
        <nav className="flex items-center justify-between w-full h-full content-container txt-xsmall-plus text-ui-fg-subtle text-small-regular">
          <div className="flex items-center flex-1 h-full gap-8 basis-0">
            <div className="h-full">
              <SideMenu regions={regions} menuItems={SideMenuItems} />
            </div>
            <div className="hidden small:flex">
              {HomeIconLink()}
            </div>
          </div>

          <div className="flex items-center h-full">
            <div className="small:hidden">
              {HomeIconLink()}
            </div>
            <div className="items-center hidden h-full small:flex gap-x-6">
              {Object.entries(MenuItems).map(([name, href], index) => {
                return (
                  <LocalizedClientLink
                    href={href}
                    className="font-sans text-sm font-medium uppercase text-dark-sm hover:text-primary-sm"
                    data-testid={`nav-${name}-link`}
                    key={index}
                  >
                    {name}
                  </LocalizedClientLink>
                )
              })}
            </div>
          </div>

           <div className="flex items-center justify-end flex-1 h-full gap-x-6 basis-0">
            <LanguageSelect />
            <LocalizedClientLink
              href="/reserve"
              data-testid="nav-reservation-link"
            >
              <Button variant="primary" className="uppercase rounded-none">Reservar</Button>
            </LocalizedClientLink>
          {/** TODO Shopping Cart
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex gap-2 hover:text-ui-fg-base"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
            */}
          </div>
        </nav>
      </header>
    </div>
  )
}
