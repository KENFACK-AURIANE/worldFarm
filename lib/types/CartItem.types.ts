import { Product } from "./product.types"
export interface CartItemD{
    produit: Product
    quantity: number
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  variationId?: string | null;
  unitPriceCaptured: number;
  originalPrice?: number | null;
  quantity: number;
  lineTotal: number;
  minQuantity?: number;
  maxQuantity?: number;
  stock?: number;
  shopId: string;
  shopName: string;
  shopSlug: string;
  shopIsVerified: boolean;
  imageUrl: string;
  
}

export interface ShopGroup {
  shopName: string;
  isVerified: boolean;
  itemstotal: number;
  subtotal: number;
  estimatedCost: number;
  items: CartItem[];
}