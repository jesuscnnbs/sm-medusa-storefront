import React from "react"
import { Container, Heading } from "@medusajs/ui"

type OrderOverviewProps = {
  orders?: any[]
}

const OrderOverview = ({ orders = [] }: OrderOverviewProps) => {
  if (!orders.length) {
    return (
      <Container className="text-center py-8">
        <Heading level="h2" className="mb-4">No orders found</Heading>
        <p className="text-ui-fg-subtle">You haven't placed any orders yet.</p>
      </Container>
    )
  }

  return (
    <Container>
      <Heading level="h2" className="mb-4">Your Orders</Heading>
      {/* TODO: Implement order list when backend is ready */}
      <p className="text-ui-fg-subtle">Orders will be displayed here when connected to your backend.</p>
    </Container>
  )
}

export default OrderOverview