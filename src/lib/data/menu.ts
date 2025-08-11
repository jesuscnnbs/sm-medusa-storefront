"use server"

import { MenuItem, MenuCategoryType } from "../../types/global"

export const listMenuItems = async (query?: Record<string, any>) => {
  // TODO: Replace with your actual backend API call
  // For now, return empty array
  const menuItems: MenuItem[] = []
  return transformToCategoryStructure(menuItems)
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