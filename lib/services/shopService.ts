/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryGraphql } from "@/lib/api/apiGraphql";

export const GET_TOP_SHOPS = `
  query {
  topShops {
    content {
      shopId
      isVerified
      name
      logoUrl
      isSponsored
      address {
        city
        country
        region
        countryIcon
        countryIso
      }
    }
  }
}
`;

export const FETCH_SHOP_BY_ID = `
  query GetShopDetails($shopId: String!) {
    fetchShopById(shopId: $shopId) {
      shopId
      isVerified
      name
      logoUrl
      coverImageUrl
      description
      totalSales
      totalProducts
      reviewsCount
      isSponsored
      categories {
        id
        name
        color
        logoUrl
        subCategories {
          id
          name
        }
      }
      minimumOrderAmount
      shopType{
        name
      }
      data{
        numberOfProducts
        numberOfSales
        numberOfSubscribers
        rating
      }
      souscription { 
        shopSouscriptionType{
          name
        }
        active
      }
      address {
        city
        country
        region
        countryIcon
        countryIso
      }
      deliveryZones{
        city
        region
        estimatedDays
        estimatedCost
        isAvailable
      }
      hourlies {
        monday {
         start 
         end 
         closed
        }
        tuesday {
         start
          end 
          closed}
        wednesday { 
          start 
          end 
          closed}
        thursday { 
          start 
          end 
          closed
        }
        friday {
         start 
         end 
         closed}
        saturday { 
          start 
          end 
          closed}
        sunday { 
          start 
          end 
          closed 
        }
      }

    }
  }
`;

// export const GET_ALL_SHOPS = `
//   query {
//   allShops {
//     content {
//       shopId
//       isVerified
//       name
//       logoUrl
      
//     }
//   }
// }
// `;

export const GET_ALL_SHOPS = `
  query {
    allShops(size: 100) { # On demande 100 boutiques d'un coup
      content {
        shopId
        isVerified
        name
        logoUrl
        data{
          numberOfProducts
          numberOfSales
          numberOfSubscribers
          rating
        }
        address {
          city
          country
          region
          countryIcon
        }
      }
    }
  }
`;
export const GET_FILTERED_SHOPS = `
  query($filter: ShopSearchInput) {
    findScoredShop(filter: $filter, size: 100) {
      content {
        shopId
        name
        logoUrl
        address {
          city
          region
          country
          countryIso
          countryIcon
        }
          data{
          numberOfProducts
          numberOfSales
          numberOfSubscribers
          rating
        }
      }
    }
  }
`;


export const createShop = async (input: any) => {
  const mutation = `
    mutation SaveShop($shopId: String, $input: ShopCreationInput!) {
      saveShop(shopId: $shopId, input: $input) {
        shopId
        name
      }
    }
  `;

  // ✅ On passe 'mutation' comme premier argument
  const res = await queryGraphql(mutation, { 
    shopId: null, 
    input: input 
  });

  // Extraction selon ta structure habituelle
  return res?.data?.saveShop || res?.saveShop;
};

export const FETCH_SHOPS_QUERY = `
  query GetUserShops {
    userShops( size: 10) {
      content {
        shopId
        name
        logoUrl
        totalProducts
        totalSales
        rating
        isActive
        isVerified
        data{
          numberOfProducts
          numberOfSales
          numberOfSubscribers
          rating
        }
        address {
          city
          region
          country
          countryIcon
        }
        souscription { 
          shopSouscriptionType{
            name
          }
          active
        }
      }
    }
  }
`;


