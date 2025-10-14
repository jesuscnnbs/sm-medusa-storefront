// Re-export all queries from separate domain files
// This maintains the existing import structure while organizing code into separate files

// Admin Users
export {
  createAdminUser,
  getAdminUserByEmail,
  getAllAdminUsers
} from './admin-users'

// Menu Categories  
export {
  createMenuCategory,
  getAllMenuCategories,
  updateMenuCategory,
  deleteMenuCategory,
  listMenuCategories
} from './menu-categories'

// Menu Items
export {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  getMenuItemsByCategory,
  updateMenuItem,
  deleteMenuItem,
  listMenuItems
} from './menu-items'

// Site Settings
export {
  createSiteSetting,
  getSiteSetting,
  getAllSiteSettings,
  getPublicSiteSettings,
  updateSiteSetting,
  upsertSiteSetting
} from './site-settings'

// Menu Profiles
export {
  getAllMenuProfiles,
  getMenuProfileById,
  updateMenuProfile,
  toggleMenuProfileActive
} from './menu-profiles'

// Dashboard
export {
  getDashboardStats
} from './dashboard'