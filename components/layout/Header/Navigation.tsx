'use client' 
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import {Bell, Briefcase, Grid, Home, Mail, Menu, ShoppingCart, Store, Tag, X } from 'lucide-react'


const Navigation = () => {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

  return (
   <nav >
        <div > 
            {/* menu desktop        */}
            <ul className='hidden md:flex justify-between pl-5 pr-5'>
                <li>
                    <Link href="/client/acceuil" className={ pathname === '/client/acceuil' ? " text-primary-dark border-b-2  border-primary-dark font-medium flex flex-row gap-4 pb-2" : "flex flex-row gap-4 no-underline text-text-primary font-meduim transition-colors duration-300 hover:text-primary-dark"}>
                        Acceuil
                    </Link>
                </li>
                <li>
                    <Link href="/client/boutiques" className={ pathname === '/client/boutiques' ? " text-primary-dark border-b-2  border-primary-dark font-medium flex flex-row gap-4 pb-2" : "flex flex-row gap-4 no-underline text-text-primary font-meduim transition-colors duration-300 hover:text-primary-dark"}>
                       Boutiques
                    </Link>
                </li>
                <li>
                    <Link href="/client/categories" className={ pathname === '/client/categories' ? " text-primary-dark border-b-2  border-primary-dark font-medium flex flex-row gap-4 pb-2" : "flex flex-row gap-4 no-underline text-text-primary font-meduim transition-colors duration-300 hover:text-primary-dark"}>
                        Categories
                    </Link>
                </li>
                <li>
                    <Link href="/client/offres"  className={ pathname === '/client/offres' ? " text-primary-dark border-b-2  border-primary-dark font-medium flex flex-row gap-4 pb-2" : "flex flex-row gap-4 no-underline text-text-primary font-meduim transition-colors duration-300 hover:text-primary-dark"}>
                        Offres
                    </Link>
                </li>
                <li>
                    <Link href="/client/espaceVendeur"  className={ pathname === '/client/espaceVendeur' ? " text-primary-dark border-b-2  border-primary-dark font-medium flex flex-row gap-4 pb-2" : "flex flex-row gap-4 no-underline text-text-primary font-meduim transition-colors duration-300 hover:text-primary-dark"}>
                        Espace Vendeur
                    </Link>
                </li>
            </ul>
        </div>

        {  /* menu mobile */}
        <div className='flex flex-col fixed top-20 right-0 w-70 z-50   md:hidden'>
            <div className='fixed top-20 right-5  md:hidden'>
                {isOpen ?
                    <button>
                        <X size={40} className='md:hidden' onClick={() => setIsOpen(!isOpen)} />
                    </button> : <button>
                        <Menu size={40} className='md:hidden' onClick={() => setIsOpen(!isOpen)} />
                    </button> 
                }
                
            </div>
           
            <div className=' '>
                {isOpen && (
                    <ul className='flex flex-col  bg-background justify-between h-screen pl-5 pt-10 pb-40'>
                        <li>
                                
                            <Link href="/client/acceuil" className={ pathname === '/client/acceuil' ? " text-primary-dark border-b-2  border-primary-dark font-medium flex flex-row gap-4 pb-2" : "flex flex-row gap-4 no-underline text-text-primary font-meduim transition-colors duration-300 hover:text-primary-dark"} >
                                <Home /> Acceuil
                            </Link>
                        </li>
                        <li>
                            <Link href="/client/boutiques" className={ pathname === '/client/boutiques' ? " text-primary-dark border-b-2  border-primary-dark font-medium flex flex-row gap-4 pb-2" : "flex flex-row gap-4 no-underline text-text-primary font-meduim transition-colors duration-300 hover:text-primary-dark"}>
                                <Store /> Boutiques
                            </Link>
                        </li>
                        <li>
                            <Link href="/client/categories" className={ pathname === '/client/categories' ? " text-primary-dark border-b-2  border-primary-dark font-medium flex flex-row gap-4 pb-2" : "flex flex-row gap-4 no-underline text-text-primary font-meduim transition-colors duration-300 hover:text-primary-dark"}>
                                <Grid />Categories
                            </Link>
                        </li>
                        <li>
                            <Link href="/client/offres" className={ pathname === '/client/offres' ? " text-primary-dark border-b-2  border-primary-dark font-medium flex flex-row gap-4 pb-2" : "flex flex-row gap-4 no-underline text-text-primary font-meduim transition-colors duration-300 hover:text-primary-dark"}>
                                <Tag />Offres
                            </Link>
                        </li>
                        <li>
                            <Link href="/client/espaceVendeur" className={ pathname === '/client/espaceVendeur' ? " text-primary-dark border-b-2  border-primary-dark font-medium flex flex-row gap-4 pb-2" : "flex flex-row gap-4 no-underline text-text-primary font-meduim transition-colors duration-300 hover:text-primary-dark"}>
                                <Briefcase />Espace Vendeur
                            </Link>
                        </li>
                        <li>
                            <Link href="/client/espaceVendeur" className={ pathname === '/client/acceuil' ? " text-primary-dark border-b-2  border-primary-dark font-medium flex flex-row gap-4 pb-2" : "flex flex-row gap-4 no-underline text-text-primary font-meduim transition-colors duration-300 hover:text-primary-dark"}>
                                <Bell />Notifications
                            </Link>
                        </li>
                        <li>
                            <Link href="/client/espaceVendeur" className={ pathname === '/client/acceuil' ? " text-primary-dark border-b-2  border-primary-dark font-medium flex flex-row gap-4 pb-2" : "flex flex-row gap-4 no-underline text-text-primary font-meduim transition-colors duration-300 hover:text-primary-dark"}>
                                <Mail />Messages
                            </Link>
                        </li>
                        <li>
                            <Link href="/client/espaceVendeur" className={ pathname === '/client/acceuil' ? " text-primary-dark border-b-2  border-primary-dark font-medium flex flex-row gap-4 pb-2" : "flex flex-row gap-4 no-underline text-text-primary font-meduim transition-colors duration-300 hover:text-primary-dark"}>
                                <ShoppingCart />Panier
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
        </div>
        
   </nav>
  )
}

export default Navigation