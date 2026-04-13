/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/enpoints";
import { BadgeCheck,  Router,  Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; 
import { FaCartPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
export default function ProductCard({ p }: any) {
    const router = useRouter();


    const AjouterAupanier = async () => {
        try{
            const response = await apiClient.post(API_ENDPOINTS.CART.ADD_CART,{
                productId: p.id,
                variationId: null,
                quantity: 1
            });
            router.push("/client/panier")
        } catch (error:any){

            console.log(error)

        }
      
      
        
    }

  return (
    <div key={p.id} className="border-none shadow-card rounded-xl">
        <Link href={`/client/produit/${p.id}`} className="block">   
            {/* image du produit */}
            <div  className="relative aspect-square w-full rounded-t-xl overflow-hidden bg-amber-500 h-70 ">
                <div className="bg-red-500 h-full">
                    <Image src={p.imageUrl} alt={p.name} width={150} height={200} className="object-cover w-full h-full" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                </div>
                <div className="absolute bottom-2 left-0 right-15   flex flex-col items-center justify-between text-xl ">
                    <p className="text-white  font-bold">
                        {p.price} FCFA
                    </p>
                    <p className="text-white  line-through ">
                        {p.originalPrice ? `${p.originalPrice} FCFA` : ''} 
                    </p>
                </div>
                <div className="absolute bottom-2 right-3 bg-white p-2 flex items-center rounded-lg ">
                    <button type="button" onClick={AjouterAupanier}>
                        <FaCartPlus size={25} className="text-primary-dark " />
                    </button>
                </div>
                
            </div>
            
            {/* informations du produit */}
            <div className="p-1 flex flex-col justify-between ">
                {/* nom et nom de la boutique */}
                <div className=" ">
                    
                    <div>
                        <h3 className="truncate font-semibold mb-2 ">
                            {p.name}
                        </h3>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row items-center justify-center gap-2">
                                <Store size={20} className=""/> 

                                <p className="">
                                    {p.shop?.name} 
                                    
                                </p>
                            </div>
                            
                            {p.shop?.isVerified ? <BadgeCheck  className="fill-primary-dark stroke-white"/> :   ""}
                        </div>
                    </div>
                </div>

                
            </div>
        </Link>  

    </div>
  );
}