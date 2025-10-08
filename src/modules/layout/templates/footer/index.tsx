import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {

  return (
    <footer className="w-full border-t border-ui-border-base bg-ui-bg-base">
      <div className="flex flex-col w-full content-container bg-footer">
        <div className="flex justify-between w-full mb-16 text-ui-fg-muted pt-72">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} <span className="font-lemonMilk">Santa Mónica</span> All rights reserved.
          </Text>
          <Text>Made with love by jesuscnnbs</Text>
        </div>
      </div>
    </footer>
  )
}
