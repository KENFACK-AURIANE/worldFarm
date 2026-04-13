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
      description
      totalProducts
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
      deliveryZones{
        city
        region
        estimatedDays
        estimatedCost
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
  // On ajoute le paramètre $shopId (même s'il est null pour une création)
  const mutation = `
    mutation SaveShop($shopId: String, $input: ShopCreationInput!) {
      saveShop(shopId: $shopId, input: $input) {
        shopId
        name
      }
    }
  `;

  const res = await queryGraphql("", {
    query: mutation,
    variables: { 
      shopId: null, // Pour une création, on envoie null
      input: input  // Votre formulaire
    },
  });

  // Vérification de sécurité pour éviter le crash si l'API répond une erreur
  if (res.data?.errors) {
    throw new Error(res.data.errors[0].message);
  }

  return res.data.data.saveShop;
};

