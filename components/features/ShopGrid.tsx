/* eslint-disable @typescript-eslint/no-explicit-any */
import ShopCard from "./ShopCard";
export default function ShopGrid({ shops }: any) {

  return (
    <div  className="flex gap-4 overflow-x-auto  pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:display-none pl-3">

      {shops.map((s:any) => (
        <div key={s.shopId} className="flex-none"> 
          <ShopCard s = {s} key={s.shopId}/>
        </div>

      ))}

    </div>
  );
}