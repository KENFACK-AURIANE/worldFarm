/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductCard from "./ProductCard";
export default function ProductGrid({ products }: any) {

  return (
    <div className="grid grid-cols-2 gap-4 w-full md:grid-cols-4">

      {products.map((p:any) => (
        <ProductCard p = {p} key={p.id}/>

      ))}

    </div>
  );
}