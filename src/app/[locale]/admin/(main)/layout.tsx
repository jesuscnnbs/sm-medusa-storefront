import { Metadata } from "next"
import SantaMonicaIcon from "@modules/common/icons/santa-monica"
import { getCurrentAdmin } from "@lib/auth/admin"
import { createAdminLogoutAction } from "@lib/data/admin"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: {
    template: "%s - Santa Monica Admin",
    default: "Santa Monica Admin",
  },
  description: "Admin panel for Santa Monica restaurant",
}

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const currentAdmin = await getCurrentAdmin()
  
  if (!currentAdmin) {
    redirect(`/${locale}/admin/login`)
  }

  const adminLogoutAction = await createAdminLogoutAction(locale)

  return (
    <div className="min-h-screen bg-light-sm-darker">
      <div className="shadow bg-light-sm-lighter">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="flex gap-2">
                <SantaMonicaIcon size={30}/>
                <h1 className="text-2xl font-lemonMilk text-secondary-sm">
                  Santa Mónica
                </h1>
              </div>
              <p className="text-sm text-grey-sm">
                Bienvenido, {currentAdmin.name} ({currentAdmin.role})
              </p>
            </div>
            <form action={adminLogoutAction}>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 border bg-primary-sm hover:bg-primary-sm-darker border-primary-sm-darker"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}