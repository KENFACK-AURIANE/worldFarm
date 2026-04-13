"use client";
import { ChevronLeft, Heart, Share2 } from 'lucide-react'
import {useRouter} from 'next/navigation'

const Productpage = ({ productName }: { productName: string }) => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-4 p-4 sticky top-0 bg-teal-600/10 backdrop-blur-md z-10 md: w-screen ">
        <button className="p-2 bg-teal-600 text-white rounded-full">
          <ChevronLeft size={24} onClick={() => {router.back()}} />
        </button>
        <h1 className="font-bold text-teal-800 uppercase tracking-wide">{productName}</h1>
        <div className="flex gap-2">
          <button className="p-2 text-white bg-teal-600/50 rounded-full"><Share2 size={20} /></button>
            <button className="p-2 text-white bg-teal-600/50 rounded-full"><Heart size={20} /></button>
        </div>
      </div>
  )
}

export default Productpage

