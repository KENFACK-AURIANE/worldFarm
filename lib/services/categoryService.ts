export const GET_CATEGORIES = `
  query {
    getCategories {
      id
      name
      logoUrl
      subCategories {
        id
        name
        logoUrl

        subCategories {
          id
          name
          logoUrl
        }
      }
    }
  }
`;

export const GET_CATEGORIES_BY_ID = `
  query GetCategoriesById($parentId: String!) {
      getCategories(parentId: $parentId){
        id
        name
        logoUrl
        subCategories {
          id
          name
          logoUrl

          subCategories {
            id
            name
            logoUrl
          }
        }
      }  
    }
`;

// export const GET_CATEGORIES = `
// query GetCategories {
//   getCategories { # Récupère les parents
//     id
//     name
//     subCategories { # Récupère les enfants (si le champ existe)
//       id
//       name
//     }
//   }
// }
// `;