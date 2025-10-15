import Link from "next/link"
import CategoryForm from "@modules/admin/components/category-form"

export default function CreateCategoryPage() {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/categories"
              className="inline-flex items-center mb-4 text-sm font-medium transition-colors text-primary-sm hover:text-primary-sm-darker"
            >
              Volver a Categorías
            </Link>
            <h1 className="mb-2 text-2xl font-bold text-dark-sm">
              Crear Nueva Categoría
            </h1>
            <p className="text-grey-sm">
              Crea una nueva categoría para organizar los platos de tu menú
            </p>
          </div>
        </div>
      </div>

      <CategoryForm mode="create" />
    </>
  )
}
