/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, use } from "react";
import { queryGraphql } from "@/lib/api/apiGraphql";
import { GET_PRODUCTS } from "@/lib/services/productService";
import Image from "next/image";
import { ChevronLeft, Shapes } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation"; 
import ProductGrid from "@/components/features/cart/ProductGrid";

export default function CategoryProductsPage({ params }: { params: Promise<{ subCatId: string }> }) {
  // On déballe l'ID de l'URL
  const { subCatId } = use(params); 
  const [products, setProducts] = useState<any[]>([]);
   const [categoryName, setCategoryName] = useState<string>("");
   const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const res = await queryGraphql(GET_PRODUCTS, { categoryId: subCatId, size: 50 });
      const allProducts = res?.data?.findAllProduct?.content || res?.findAllProduct?.content || [];
      setProducts(allProducts);
      
    };
    load();
  }, [subCatId]);

  return (
    <div className="">

      {/* header */}
      <div className="sticky top-0 z-50 w-full shadow-md bg-primary-light/99  text-white p-7 flex flex-row items-center justify-between h-30 mb-5">
        <div className="flex flex-row items-center justify-between gap-2 w-75">
            <div className=" bg-primary-light/10 rounded-2xl flex flex-row items-center w-10 h-10">
            <button onClick={() => router.back()} className="pl-2">
              <ChevronLeft size={30} className="" />
            </button>
            </div>
            <div className="pl-2">
              <Shapes size={30} className="fill-white stroke-white" />
            </div>
            
            <h1 className="text-lg font-semibold ">{categoryName}</h1>
            
            
            
        </div>

        
      </div>

      <div className="px-4">
        <ProductGrid  products={products} />
      </div>
     
    </div>
  );
}
