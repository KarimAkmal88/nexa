export interface CartProductCategory {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
}

export interface CartProductBrand {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
}

export interface CartProductSubcategory {
  _id: string;
  name: string;
  slug?: string;
  category?: string;
}

export interface CartProductItemDetails {
  _id: string;
  id: string;
  title: string;
  slug?: string;
  quantity?: number;
  imageCover: string;
  category?: CartProductCategory;
  brand?: CartProductBrand;
  ratingsAverage?: number;
  subcategory?: CartProductSubcategory[];
}

export interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: CartProductItemDetails;
}

export interface CartData {
  _id?: string;
  cartOwner?: string;
  products: CartItem[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  totalCartPrice: number;
}

export interface CartResponse {
  status: string;
  message?: string;
  numOfCartItems: number;
  cartId: string | null;
  data: CartData;
  statusMsg?: string;
}

export interface CartErrorPayload {
  statusMsg?: string | number;
  message: string;
  errors?: unknown;
}
