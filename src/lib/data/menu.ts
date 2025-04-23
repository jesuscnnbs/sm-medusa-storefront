"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { MenuItem, MenuCategoryType } from "../../types/global"

export const listMenuItems = async (query?: Record<string, any>) => {
  const limit = query?.limit || Infinity
  return sdk.client.fetch<{ menuItems: MenuItem[] }>('/menu',
    {
      method: "GET",
      query: {
        limit,
        ...query,
      },
    }
  ).then(({menuItems}) => {
    console.log("menuItems", menuItems)
    return transformToCategoryStructure(menuItems)
  })
  .catch(medusaError)
}

function transformToCategoryStructure(items: MenuItem[]): MenuCategoryType[] {
  // Use a Map to group items by category
  const categoriesMap = new Map<string, MenuCategoryType>();
  
  items.forEach(item => {
    const { category, category_id, ...itemData } = item;
    
    // If the category is not yet in our map, add it
    if (!categoriesMap.has(category.id)) {
      categoriesMap.set(category.id, {
        ...category,
        items: []
      });
    }
    
    // Add the current item to its category
    const categoryGroup = categoriesMap.get(category.id);
    if (categoryGroup) {
      (categoryGroup.items ??= []).push({
        ...itemData,
        category_id,
        category
      });
    }
  });
  
  // Convert the map values to an array
  return Array.from(categoriesMap.values());
}