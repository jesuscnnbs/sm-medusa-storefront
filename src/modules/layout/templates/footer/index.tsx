import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="w-full border-t border-ui-border-base bg-footer">
      <div className="flex flex-col w-full content-container">
        
        <div className="flex justify-between w-full mb-16 text-ui-fg-muted pt-72">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} <span className="font-lemonMilk">Santa Mónica</span> All rights reserved.
          </Text>
          <MedusaCTA />
        </div>
      </div>
    </footer>
  )
}
