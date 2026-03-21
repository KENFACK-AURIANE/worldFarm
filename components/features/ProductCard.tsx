/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadgeCheck,  ShieldCheck,  Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; 
import { FaCartPlus } from "react-icons/fa";
export default function ProductCard({ p }: any) {

  return (
    <div key={p.id} className="border-none shadow-card rounded-md">
        <Link href={`/client/produit/${p.id}`} className="block">   
            {/* image du produit */}
            <div  className="relative aspect-square w-full overflow-hidden">
                <Image src={p.imageUrl} alt={p.name} width={150} height={150} className="object-cover w-full h-full" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </div>
            
            {/* informations du produit */}
            <div className="p-1 flex flex-col justify-between ">
                {/* nom et nom de la boutique */}
                <div className=" h-30">
                    
                    <div>
                        <h3 className="font-semibold mb-2  h-20">
                            {p.name}
                        </h3>
                        <div className="flex flex-row gap-1">
                            <Store size={20} className=""/> 

                            <p className="">
                                {p.shop?.name} 
                                
                            </p>
                            {p.shop?.isVerified ? <BadgeCheck  className="text-blue-500"/> :   ""}
                        </div>
                    </div>
                </div>

                {/* prix et bouton d'ajout au panier */}
                <div className=" h-20">
                    <div className="flex flex-row justify-between  h-10">
                        <div>
                                <p className="text-primary-dark font-bold">
                                {p.price} FCFA
                            </p>
                            <p className="text-text-secondary  line-through text-sm">
                                {p.originalPrice ? `${p.originalPrice} FCFA` : ''} 
                            </p>
                        </div>
                        
                        <div className="bg-primary-dark p-1 flex items-center rounded">
                            <button type="button">
                                <FaCartPlus size={20} className="text-white" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <ShieldCheck size={20} className="text-primary-dark" />
                        <p className="text-xs">
                            Paiement protégé par World Farm
                        </p>
                    </div>
                </div>
            </div>
        </Link>  

    </div>
  );
}