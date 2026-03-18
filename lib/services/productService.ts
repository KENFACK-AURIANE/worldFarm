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
      shop {
        name
        slug
        isVerified
      }
    } 

  }

}
`;