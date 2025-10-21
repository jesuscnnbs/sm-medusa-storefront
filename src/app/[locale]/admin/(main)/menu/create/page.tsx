import Link from "next/link"
import MenuProfileForm from "@modules/admin/components/menu-profile-form"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"

export default function CreateMenuPage() {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
            <BrutalButtonLink
              href="/admin/menu"
              variant="neutral"
              size="sm"
            >
               ← Volver a Menús
            </BrutalButtonLink>
          </div>
      </div>

      <MenuProfileForm mode="create" />
    </>
  )
}