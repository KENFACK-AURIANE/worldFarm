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