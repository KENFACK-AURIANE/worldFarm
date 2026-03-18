"use client"

import { useEffect, useState } from "react"
import { getFeaturedByZone } from "@/lib/services/featuresServices"
import Image from "next/image"

type FeaturedItem = {
  id: string
  imageUrl: string
  clickUrl: string
}

export default function FeaturedCarousel() {

  const [items, setItems] = useState<FeaturedItem[]>([])
  const [index, setIndex] = useState(0)
  const zone = "HOME_TOP"


  // récupération des images
  useEffect(() => {

    const fetchImages = async () => {

      const results = await getFeaturedByZone(zone)
      setItems(results)

    }

    fetchImages()

  }, [])

  // défilement automatique
  useEffect(() => {

    if (items.length === 0) return

    const interval = setInterval(() => {

      setIndex((prev) => (prev + 1) % items.length)

    }, 4000)

    return () => clearInterval(interval)

  }, [items])

  return (

    <div className="w-full mt-10  overflow-hidden md:mt-5">

      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >

        {items.map((item) => (

          <a
            key={item.id}
            href={item.clickUrl}
            className="w-full  shrink-0 pl-3 pr-5"
            
          >

            {item.imageUrl && (
              <Image
                key={item.id}
                src={encodeURI(item.imageUrl)}
                alt="carousel image"
                width={1200}
                height={50}
                className="object-cover max-h-50 w-full md:max-h-100 rounded-lg"
              />
            )}

          </a>

        ))}

      </div>

    </div>

  )
}