import { Metadata } from "next"
import { notFound } from "next/navigation"

import ProductTemplate from "@modules/products/templates"
import { getProductByHandle } from "@lib/data/products"

export const dynamic = "force-dynamic" // TODO Remove

type Props = {
  params: Promise<{ handle: string }>
}


export async function generateStaticParams() {
  // TODO: Implement static params generation without Medusa
  return []
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { handle } = params

  const product = await getProductByHandle(handle)

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Santa Mónica`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Santa Mónica`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params;

  const product = await getProductByHandle(params.handle)
  if (!product) {
    notFound()
  }

  return (
    <ProductTemplate
      product={product}
    />
  )
}
