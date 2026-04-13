import Image from "next/image"
import SearchBar from "./SearchBar"
import Notification from "./Notification"
import Panier from "./Panier"
import Avatar from "./Avatar"
import Message from "./Message"
import Navigation from "./Navigation"
import Link from "next/link"; 

export default function Header(){
    return(
        <nav className="sticky top-0 z-50 w-full shadow-md">
            <div className="flex flex-row gap-5 justify-between bg-green-800 h-20 p-5 items-center overflow-x-hidden overflow-y-hidden  ">
                <Image
                    src="/images/logo.png"
                    alt="logo"
                    width={100}
                    height={100}
                    className="w-12 h-full  xl-h-30"
                />
                <SearchBar />
                <Notification />
                <Message />
                <Link href="/client/panier" className="flex flex-row gap-4 no-underline text-text-primary font-meduim transition-colors duration-300 hover:text-primary-dark">
                    <Panier />
                </Link>
                <Avatar />
            </div>
            <Navigation />
        </nav>
    )
}