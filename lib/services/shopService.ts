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
