import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Login - Santa Monica",
  description: "Admin login for Santa Monica restaurant management",
}

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-light-sm-darker">
      {children}
    </div>
  )
}