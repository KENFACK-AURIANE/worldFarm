interface DeliveryZone {
  city: string;
  region: string;
  estimatedCost: string;
  estimatedDays: string;
  isAvailable: boolean;
  
}

export interface Shop {
  shopId: string; // ID dans l'API
  name: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?:string;
  displayImages?: string;
  isSponsored:boolean;
  minimumOrderAmount?:number,
  address?: { region?: string; city?: string, country?: string, countryIso?: string }; // Selon ton objet Address
  totalProducts: number;
  totalSales: number;
  rating: number;
  isActive: boolean;
  deliveryZones: DeliveryZone[];

  shopType:{
    name: string
  }
  data:{
    numberOfProducts: number;
    numberOfSales: number;
    numberOfSubscribers: number;
    rating: number;
  }
  souscription: { 
    shopSouscriptionType:{
      name: string
    }
    active: boolean
  };
  
  isVerified: boolean;
}