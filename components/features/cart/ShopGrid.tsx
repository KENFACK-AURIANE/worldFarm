/* eslint-disable @typescript-eslint/no-explicit-any */
import ShopCard from "./ShopCard";
export default function ShopGrid({ shops }: any) {

  return (
    <div  className="grid mx-2 grid-cols-2 gap-4 pl-3 md:grid-cols-5">

      {shops.map((s:any) => (
        <div key={s.shopId} className="flex-none"> 
          <ShopCard s = {s} key={s.shopId}/>
        </div>

      ))}
      {/* <div  className="grid grid-rows-2 grid-flow-col  gap-4 overflow-x-auto  pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:display-none pl-3">
  
      </div> */}

    </div>
  );
}

 