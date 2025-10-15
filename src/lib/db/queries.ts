// Re-export all queries from separate domain files
// This maintains the existing import structure while organizing code into separate files

// Admin Users
export {
  createAdminUser,
  getAdminUserByEmail,
  getAllAdminUsers
} from './queries/admin-users'

// Menu Categories
export {
  createMenuCategory,
  getAllMenuCategories,
  getMenuCategoryById,
  updateMenuCategory,
  deleteMenuCategory,
  toggleMenuCategoryActive,
  hardDeleteMenuCategory,
  listMenuCategories
} from './queries/menu-categories'

// Menu Items
export {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  getMenuItemsByCategory,
  updateMenuItem,
  deleteMenuItem,
  listMenuItems
} from './queries/menu-items'

// Site Settings
export {
  createSiteSetting,
  getSiteSetting,
  getAllSiteSettings,
  getPublicSiteSettings,
  updateSiteSetting,
  upsertSiteSetting
} from './queries/site-settings'

// Menu Profiles
export {
  createMenuProfile,
  getAllMenuProfiles,
  getMenuProfileById,
  updateMenuProfile,
  toggleMenuProfileActive,
  deleteMenuProfile,
} from './queries/menu-profiles'

// Dashboard
export {
  getDashboardStats
} from './queries/dashboard'

// Menu Profile Items (Many-to-Many associations)
export {
  addItemToMenuProfile,
  removeItemFromMenuProfile,
  getMenuProfileItems,
  updateMenuProfileItemSortOrder,
  setMenuProfileItems
} from './queries/menu-profile-items'