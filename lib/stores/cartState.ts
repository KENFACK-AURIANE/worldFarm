import { Product } from "../types/product.types"
import { CartItem } from "../types/CartItem.types"

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  
  // Actions
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}