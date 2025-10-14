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
  updateMenuCategory,
  deleteMenuCategory,
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
  getAllMenuProfiles,
  getMenuProfileById,
  updateMenuProfile,
  toggleMenuProfileActive
} from './queries/menu-profiles'

// Dashboard
export {
  getDashboardStats
} from './queries/dashboard'