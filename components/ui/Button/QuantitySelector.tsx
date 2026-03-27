"use client";
import { Plus, Minus } from "lucide-react";

const QuantitySelector = ({
  product,
  quantity,
  setQuantity,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  quantity: number;
  setQuantity: (value: number | ((prev: number) => number)) => void;
}) => {

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="flex items-center justify-between w-[300px] font-sans">
      
      <span className="text-lg font-semibold text-gray-800">
        Quantité
      </span>

      <div className="flex items-center gap-4">
        
        {/* - */}
        <button
          onClick={decrement}
          disabled={quantity <= 1}
          className={`flex items-center justify-center w-10 h-10 rounded-lg 
          bg-teal-50 text-teal-700 transition 
          ${quantity <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-100"}`}
        >
          <Minus size={18} />
        </button>

        {/* valeur */}
        <span className="text-xl font-bold min-w-[20px] text-center">
          {quantity}
        </span>

        {/* + */}
        <button
          onClick={increment}
          disabled={quantity >= product.stock}
          className={`flex items-center justify-center w-10 h-10 rounded-lg 
          bg-teal-50 text-teal-700 transition 
          ${quantity >= product.stock ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-100"}`}
        >
          <Plus size={18} />
        </button>

      </div>
    </div>
  );
};

export default QuantitySelector;