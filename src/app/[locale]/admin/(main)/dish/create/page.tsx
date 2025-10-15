import Link from "next/link"
import DishForm from "@modules/admin/components/dish-form"

export default function CreateDishPage() {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/dish"
              className="inline-flex items-center mb-4 text-sm font-medium transition-colors text-primary-sm hover:text-primary-sm-darker"
            >
              Volver a Platos
            </Link>
            <h1 className="mb-2 text-2xl font-bold text-dark-sm">
              Crear Nuevo Plato
            </h1>
            <p className="text-grey-sm">
              Crea un nuevo plato para anadir a tu menu
            </p>
          </div>
        </div>
      </div>

      <DishForm mode="create" />
    </>
  )
}
