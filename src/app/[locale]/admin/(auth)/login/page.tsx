import { redirect } from "next/navigation"
import { Metadata } from "next"
import AdminLogin from "@modules/admin/components/admin-login"
import { getCurrentAdmin } from "@lib/auth/admin"

export const metadata: Metadata = {
  title: "Admin Login - Santa Monica",
  description: "Admin login for Santa Monica restaurant management",
}

export default async function AdminLoginPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  // Await params in Next.js 15
  const { locale } = await params
  
  // Temporarily comment out this check to avoid redirect loop
  // Check if user is already logged in
  const currentAdmin = await getCurrentAdmin()
  
  if (currentAdmin) {
    // Already logged in, redirect to dashboard
    redirect(`/${locale}/admin/dashboard`)
  }

  return <AdminLogin />
}