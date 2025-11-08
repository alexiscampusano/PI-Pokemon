import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchPokemons, fetchPokemonDetails, setFilters, cleanDetails } from '../redux/pokemonSlice';
import type { PokemonFilters } from '../types/api';

export const usePokemon = () => {
  const dispatch = useAppDispatch();
  const { pokemons, loading, error, pagination, filters } = useAppSelector(
    (state) => state.pokemon
  );

  useEffect(() => {
    dispatch(fetchPokemons(filters));
  }, [dispatch, filters]);

  const updateFilters = (newFilters: Partial<PokemonFilters>) => {
    dispatch(setFilters(newFilters));
  };

  const loadPokemonDetails = (id: string | number) => {
    dispatch(fetchPokemonDetails(id));
  };

  const clearDetails = () => {
    dispatch(cleanDetails());
  };

  return {
    pokemons,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    loadPokemonDetails,
    clearDetails,
  };
};

