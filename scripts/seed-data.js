// Shared seed data for both seed.js and seed-neon.js
// This file contains all the data used to seed the database

module.exports = {
  // Menu Profile
  menuProfile: {
    name: 'Menú Principal',
    nameEn: 'Main Menu',
    description: 'Nuestro delicioso menú de hamburguesas artesanales',
    descriptionEn: 'Our delicious artisanal burger menu',
    isActive: true,
    isDefault: true,
    sortOrder: 0
  },

  // Menu Categories
  categories: [
    {
      name: 'Hamburguesas Clásicas',
      nameEn: 'Classic Burgers',
      description: 'Nuestras hamburguesas más populares',
      descriptionEn: 'Our most popular burgers',
      sortOrder: 1
    },
    {
      name: 'Hamburguesas Gourmet',
      nameEn: 'Gourmet Burgers',
      description: 'Hamburguesas premium con ingredientes especiales',
      descriptionEn: 'Premium burgers with special ingredients',
      sortOrder: 2
    },
    {
      name: 'Acompañamientos',
      nameEn: 'Sides',
      description: 'Papas, aros de cebolla y más',
      descriptionEn: 'Fries, onion rings and more',
      sortOrder: 3
    },
    {
      name: 'Bebidas',
      nameEn: 'Drinks',
      description: 'Refrescos, jugos y bebidas especiales',
      descriptionEn: 'Sodas, juices and specialty drinks',
      sortOrder: 4
    }
  ],

  // Menu Items
  menuItems: [
    // Classic Burgers
    {
      name: 'Santa Monica Classic',
      nameEn: 'Santa Monica Classic',
      description: 'Hamburguesa clásica con carne de res, lechuga, tomate, cebolla y salsa especial',
      descriptionEn: 'Classic burger with beef patty, lettuce, tomato, onion and special sauce',
      price: 1299, // $12.99
      categoryName: 'Hamburguesas Clásicas',
      ingredients: ['Carne de res 150g', 'Lechuga', 'Tomate', 'Cebolla', 'Salsa Santa Monica'],
      allergens: ['gluten', 'egg', 'soy'],
      isPopular: true,
      sortOrder: 1,
      image: 'https://drive.google.com/file/d/1W2nI_cLHVWNDHzjFqoJBxWeimTfXzIfr/view'
    },
    {
      name: 'Cheeseburger Deluxe',
      nameEn: 'Cheeseburger Deluxe',
      description: 'Hamburguesa con doble queso cheddar, tocino crujiente y vegetales frescos',
      descriptionEn: 'Burger with double cheddar cheese, crispy bacon and fresh vegetables',
      price: 1499,
      categoryName: 'Hamburguesas Clásicas',
      ingredients: ['Carne de res 150g', 'Doble queso cheddar', 'Tocino', 'Lechuga', 'Tomate'],
      allergens: ['gluten', 'milk'],
      isPopular: true,
      sortOrder: 2
    },
    // Gourmet Burgers
    {
      name: 'BBQ Bacon Supreme',
      nameEn: 'BBQ Bacon Supreme',
      description: 'Hamburguesa gourmet con salsa BBQ casera, tocino ahumado y cebolla caramelizada',
      descriptionEn: 'Gourmet burger with homemade BBQ sauce, smoked bacon and caramelized onions',
      price: 1799,
      categoryName: 'Hamburguesas Gourmet',
      ingredients: ['Carne de res 200g', 'Salsa BBQ casera', 'Tocino ahumado', 'Cebolla caramelizada', 'Queso gouda'],
      allergens: ['gluten', 'milk'],
      isPopular: false,
      sortOrder: 1
    },
    {
      name: 'Mushroom Swiss',
      nameEn: 'Mushroom Swiss',
      description: 'Hamburguesa con champiñones salteados y queso suizo derretido',
      descriptionEn: 'Burger with sautéed mushrooms and melted Swiss cheese',
      price: 1699,
      categoryName: 'Hamburguesas Gourmet',
      ingredients: ['Carne de res 180g', 'Champiñones salteados', 'Queso suizo', 'Cebolla morada', 'Mayonesa de ajo'],
      allergens: ['gluten', 'milk', 'egg'],
      isPopular: false,
      sortOrder: 2
    },
    // Sides
    {
      name: 'Papas Fritas Clásicas',
      nameEn: 'Classic French Fries',
      description: 'Papas fritas doradas y crujientes',
      descriptionEn: 'Golden and crispy french fries',
      price: 599,
      categoryName: 'Acompañamientos',
      ingredients: ['Papas', 'Sal marina'],
      allergens: [],
      isPopular: true,
      sortOrder: 1
    },
    {
      name: 'Aros de Cebolla',
      nameEn: 'Onion Rings',
      description: 'Aros de cebolla empanizados y fritos',
      descriptionEn: 'Breaded and fried onion rings',
      price: 699,
      categoryName: 'Acompañamientos',
      ingredients: ['Cebolla', 'Harina', 'Huevo', 'Pan molido'],
      allergens: ['gluten', 'egg'],
      isPopular: false,
      sortOrder: 2
    },
    // Drinks
    {
      name: 'Coca-Cola',
      nameEn: 'Coca-Cola',
      description: 'Refresco de cola clásico',
      descriptionEn: 'Classic cola soft drink',
      price: 299,
      categoryName: 'Bebidas',
      ingredients: ['Agua carbonatada', 'Jarabe de cola'],
      allergens: [],
      isPopular: true,
      sortOrder: 1
    },
    {
      name: 'Limonada Natural',
      nameEn: 'Fresh Lemonade',
      description: 'Limonada fresca hecha en casa',
      descriptionEn: 'Fresh homemade lemonade',
      price: 399,
      categoryName: 'Bebidas',
      ingredients: ['Limón fresco', 'Agua', 'Azúcar', 'Hielo'],
      allergens: [],
      isPopular: false,
      sortOrder: 2
    }
  ],

  // Site Settings
  siteSettings: [
    {
      key: 'restaurant_name',
      value: 'Santa Monica Burgers',
      description: 'Restaurant name displayed on the site',
      type: 'string',
      isPublic: true
    },
    {
      key: 'restaurant_phone',
      value: '+1 (555) 123-4567',
      description: 'Restaurant contact phone number',
      type: 'string',
      isPublic: true
    },
    {
      key: 'restaurant_email',
      value: 'info@santamonica.com',
      description: 'Restaurant contact email',
      type: 'string',
      isPublic: true
    },
    {
      key: 'restaurant_address',
      value: '123 Ocean Ave, Santa Monica, CA 90401',
      description: 'Restaurant physical address',
      type: 'string',
      isPublic: true
    },
    {
      key: 'opening_hours',
      value: JSON.stringify({
        monday: '11:00-22:00',
        tuesday: '11:00-22:00',
        wednesday: '11:00-22:00',
        thursday: '11:00-22:00',
        friday: '11:00-23:00',
        saturday: '10:00-23:00',
        sunday: '10:00-21:00'
      }),
      description: 'Restaurant opening hours',
      type: 'json',
      isPublic: true
    }
  ],

  // Admin User
  adminUser: {
    email: 'admin@santamonica.com',
    name: 'Admin User',
    password: 'admin123',
    role: 'super_admin',
    isActive: true
  }
}
