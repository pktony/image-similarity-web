/**
 * PokeAPI Client
 * Fetches Pokemon data from https://pokeapi.co/api/v2/
 */

import type { PokemonResponse } from '@/types/pokemon';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Fetch Pokemon data by name (English)
 * @param name - Pokemon name in English (case-insensitive)
 * @returns Pokemon data including sprites
 */
export async function getPokemonByName(
  name: string
): Promise<PokemonResponse> {
  const normalizedName = name.toLowerCase().trim();
  const url = `${POKEAPI_BASE_URL}/pokemon/${normalizedName}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Pokemon: ${name} (${response.status} ${response.statusText})`
    );
  }

  const data: PokemonResponse = await response.json();
  return data;
}

/**
 * Get Pokemon image URL by name
 * @param name - Pokemon name in English
 * @returns Image URL or null if not found
 */
export async function getPokemonImageUrl(
  name: string
): Promise<string | null> {
  try {
    const pokemon = await getPokemonByName(name);
    return pokemon.sprites.front_default;
  } catch (error) {
    console.error(`Failed to get Pokemon image for ${name}:`, error);
    return null;
  }
}

/**
 * Get multiple Pokemon images in parallel
 * @param names - Array of Pokemon names in English
 * @returns Array of image URLs (null for failed requests)
 */
export async function getPokemonImages(
  names: string[]
): Promise<(string | null)[]> {
  const promises = names.map((name) => getPokemonImageUrl(name));
  return Promise.all(promises);
}
