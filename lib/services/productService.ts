export const GET_PRODUCTS = `
query GetProducts($categoryId: String) {

  findAllProduct(
    page: 0,
    size: 10,
    request: { categoryId: $categoryId }
  ) {

    content {
      id
      name
      price
      imageUrl
      categoryId
      originalPrice
      shop {
        name
        slug
        isVerified
      }
    } 

  }

}
`;

export const GET_PRODUCT_BY_ID = `
  query GetProductDetails($productId: String!) {
    findProductById(productId: $productId) {
      id
      name
      price
      imageUrl
      description
      discount
      imagesUrl
      categoryId
      rating
      reviewCount
      originalPrice
      stock
      characteristics
      colors {
        name
        hexCode
      }
      shop {
        shopId
        name
        slug
        logo
        logoUrl
        isVerified
        address {
          city
          country
          region
        }
        deliveryZones{
          city
          region
          estimatedCost
          estimatedDays
          isAvailable
        }
      }
    }
  }
`;
