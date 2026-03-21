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
      
    }
  }
`;