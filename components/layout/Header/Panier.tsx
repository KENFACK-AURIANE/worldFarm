import {  ShoppingCart } from "lucide-react";

export default function Panier(){
    return(
        <div className="hidden flex-row md:flex">
            <div>
                <ShoppingCart size={30} className="text-white"/>
            </div>
        
        </div>
    )
}