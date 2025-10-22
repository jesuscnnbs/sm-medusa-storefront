import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
//import CartButton from "@modules/layout/components/cart-button"
//import { Suspense } from "react"
import SideMenu from "@modules/layout/components/side-menu"
import SantaMonicaIcon from "@modules/common/icons/santa-monica"
//import Instagram from "@modules/common/icons/instagram"
import LanguageSelect from "@modules/layout/components/language-select";
import { getTranslations } from "next-intl/server"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link";
import NavMenuTabs from "@modules/layout/components/nav-menu-tabs";

const HomeIconLink = () => {
  return (
    <LocalizedClientLink href="/" data-testid="nav-home-link" className="flex items-center transition-transform active:scale-95">
      <SantaMonicaIcon size={40} />
      <span className="mt-[2px] hidden mx-2 text-[22px] font-medium uppercase align-middle small:block text-secondary-sm font-lemonMilk">Santa<br/><span className="text-[17px]">Mónica</span></span>
    </LocalizedClientLink>
  )
}

export default async function Nav() {
  const t = await getTranslations('Common')
  //const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  const MenuItems = {
    Home: {href: "/", name: t("home")},
    About: {href: "/about", name: t("about")},
    Menu: {href: "/menu", name: t("menu")},
    //Store: "/store",
  }

  const SideMenuItems = {
    ...MenuItems,
    //Account: "/account",
    //Cart: "/cart",
  }

  return (
    <div className="sticky inset-x-0 top-0 z-30 border-b-2 border-secondary-sm">
      <header className="relative h-16 mx-auto bg-ui-bg-base">
        <nav className="flex items-center justify-between w-full h-full content-container txt-xsmall-plus text-ui-fg-subtle text-small-regular">
          <div className="flex items-center flex-1 h-full gap-8 basis-0">
            <div className="h-full">
              <SideMenu menuItems={SideMenuItems} />
            </div>
            <div className="flex">
              {HomeIconLink()}
            </div>
          </div>

          <div className="flex items-center h-full">
            <div className="items-center hidden h-full small:flex">
              <NavMenuTabs menuItems={MenuItems} />
            </div>
          </div>

           <div className="flex items-center justify-end flex-1 h-full gap-x-6 basis-0">
            <LanguageSelect />
            <BrutalButtonLink
              href="/reserve"
              data-testid="nav-reservation-link"
              variant="primary"
              size="sm"
            >
            {t("callToActionButton")}
            </BrutalButtonLink>
          </div>
        </nav>
      </header>
    </div>
  )
}
