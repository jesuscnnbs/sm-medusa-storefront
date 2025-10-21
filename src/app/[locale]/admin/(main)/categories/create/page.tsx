import CategoryForm from "@modules/admin/components/category-form"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"

export default function CreateCategoryPage() {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <BrutalButtonLink
            href="/admin/categories"
            variant="neutral"
            size="sm"
          >
            ← Volver a Categorías
          </BrutalButtonLink>
        </div>
      </div>

      <CategoryForm mode="create" />
    </>
  )
}
