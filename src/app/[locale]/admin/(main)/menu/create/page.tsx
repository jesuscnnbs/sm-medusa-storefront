import Link from "next/link"
import MenuProfileForm from "@modules/admin/components/menu-profile-form"

export default function CreateMenuPage() {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/menu"
              className="inline-flex items-center mb-4 text-sm font-medium transition-colors text-primary-sm hover:text-primary-sm-darker"
            >
               Volver a Menús
            </Link>
            <h1 className="mb-2 text-2xl font-bold text-dark-sm">
              Crear Nuevo Menú
            </h1>
            <p className="text-grey-sm">
              Crea un nuevo perfil de menú para tu restaurante
            </p>
          </div>
        </div>
      </div>

      <MenuProfileForm mode="create" />
    </>
  )
}