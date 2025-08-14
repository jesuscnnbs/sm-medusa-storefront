import { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s - Santa Monica Admin",
    default: "Santa Monica Admin",
  },
  description: "Admin panel for Santa Monica restaurant",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}