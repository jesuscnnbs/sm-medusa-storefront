import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AdminSideMenu from "@modules/admin/components/side-menu"
import SantaMonicaIcon from "@modules/common/icons/santa-monica"
import { getCurrentAdmin } from "@lib/auth/admin"
import { createAdminLogoutAction } from "@lib/data/admin"
import BrutalButton from "@modules/admin/components/brutal-button"

const AdminHomeLink = () => {
  return (
    <LocalizedClientLink href="/admin/dashboard" data-testid="admin-nav-home-link" className="flex items-center">
      <SantaMonicaIcon size={30} />
    </LocalizedClientLink>
  )
}

export default async function AdminNav({ locale }: { locale: string }) {
  const currentAdmin = await getCurrentAdmin()
  const adminLogoutAction = await createAdminLogoutAction(locale)

  if (!currentAdmin) {
    return null
  }

  const MenuItems = {
    Dashboard: { href: "/admin/dashboard", name: "Dashboard" },
    Menu: { href: "/admin/menu", name: "Menús" },
    Admin: { href: "/admin/admin", name: "Administradores" },
    Settings: { href: "/admin/settings", name: "Ajustes" },
  }

  const SideMenuItems = {
    ...MenuItems,
  }

  return (
    <div className="sticky inset-x-0 top-0 z-30 shadow-lg group">
      <header className="relative h-16 mx-auto duration-200 border-b-2 border-gray-950 bg-light-sm-lighter">
        <nav className="flex items-center justify-between w-full h-full px-4 content-container txt-xsmall-plus text-ui-fg-subtle text-small-regular">
          <div className="flex items-center flex-1 h-full gap-8 basis-0">
            <div className="h-full">
              <AdminSideMenu menuItems={SideMenuItems} />
            </div>
            <div className="flex">
              {AdminHomeLink()}
            </div>
          </div>

          <div className="flex items-center h-full">
            <div className="items-center hidden h-full small:flex gap-x-6">
              {Object.entries(MenuItems).map(([_name, item], index) => {
                return (
                  <LocalizedClientLink
                    href={item.href}
                    className="font-sans text-sm font-medium uppercase text-dark-sm hover:text-primary-sm"
                    data-testid={`admin-nav-${item.name}-link`}
                    key={index}
                  >
                    {item.name}
                  </LocalizedClientLink>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-end flex-1 h-full gap-x-6 basis-0">
            <div className="flex-col items-end hidden small:flex">
              <span className="text-xs text-grey-sm">
                {currentAdmin.name}
              </span>
              <span className="text-xs text-grey-sm-darker">
                {currentAdmin.role}
              </span>
            </div>
            <form action={adminLogoutAction}>
              <BrutalButton
                type="submit"
                variant="secondary"
                size="sm"
                data-testid="admin-logout-button"
              >
                Salir
              </BrutalButton>
            </form>
          </div>
        </nav>
      </header>
    </div>
  )
}