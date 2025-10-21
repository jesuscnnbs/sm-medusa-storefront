import DishForm from "@modules/admin/components/dish-form"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"

export default function CreateDishPage() {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <BrutalButtonLink
            href="/admin/dish"
            variant="neutral"
            size="sm"
          >
            ← Volver a Platos
          </BrutalButtonLink>
        </div>
      </div>

      <DishForm mode="create" />
    </>
  )
}
