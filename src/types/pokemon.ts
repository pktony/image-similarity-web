/**
 * PokeAPI Types
 */

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
}

export interface PokemonResponse {
  id: number;
  name: string;
  sprites: PokemonSprites;
  height: number;
  weight: number;
}

export interface PokemonImageCache {
  [pokemonName: string]: string | null;
}
