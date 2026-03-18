import Image from "next/image"
import SearchBar from "./SearchBar"
import Notification from "./Notification"
import Panier from "./Panier"
import Avatar from "./Avatar"
import Message from "./Message"
import Navigation from "./Navigation"

export default function Header(){
    return(
        <nav>
            <div className="flex flex-row gap-5 justify-between bg-green-800 h-20 p-5 items-center overflow-x-hidden overflow-y-hidden  ">
                <Image
                    src="/images/logo.jpg"
                    alt="logo"
                    width={100}
                    height={100}
                    className="w-12 h-full  xl-h-30"
                />
                <SearchBar />
                <Notification />
                <Message />
                <Panier />
                <Avatar />
            </div>
            <Navigation />
        </nav>
    )
}