export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export type MultiNamespaceTranslations = {
  [namespace: string]: Translations
}


export type Translations = {
  [key: string]: string
}

export type MenuItem = {
  id: string;
  isNotActive: boolean;
  title: string;
  description: string;
  image: string;
  category: MenuCategoryType;
  category_id: string;
};

export type MenuCategoryType = {
  id: string;
  title: string;
  description: string;
  items: MenuItem[];
};
