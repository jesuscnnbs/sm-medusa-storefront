import { Metadata } from "next"
import { getCurrentAdmin } from "@lib/auth/admin"
import { redirect } from "next/navigation"
import AdminNav from "@modules/admin/templates/nav"

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

  return (
    <div className="min-h-screen bg-light-sm-darker">
      <AdminNav locale={locale} />
      
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}