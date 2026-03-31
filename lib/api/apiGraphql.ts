/* eslint-disable @typescript-eslint/no-explicit-any */
const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL;

import {apiClient} from "./client"; 

export async function queryGraphql(query:string, variables = {}) {
  try {
    // On utilise apiClient au lieu de fetch
    // L'intercepteur ajoutera le header Authorization tout seul !
    const response = await apiClient.post("/graphql", {
      query,
      variables,
    });

    // Axios place les données dans .data
    // Le serveur GraphQL place les données dans .data.data
    return response.data.data || null;

  } catch (error: any) {
    console.error("Erreur API GraphQL :", error.response?.data || error.message);
    return null;
  }
}