"use server"

// Simplified categories data functions without Medusa

export const listCategories = async () => {
  // TODO: Replace with your actual backend API call
  console.log('Listing categories')
  return { product_categories: [] }
}

export const getCategoryByHandle = async (handle: string[]) => {
  // TODO: Replace with your actual backend API call
  console.log(`Getting category by handle: ${handle.join('/')}`)
  return null
}