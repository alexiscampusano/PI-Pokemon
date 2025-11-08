import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchTypes } from '../redux/pokemonSlice';

export const useTypes = () => {
  const dispatch = useAppDispatch();
  const { types, loading, error } = useAppSelector((state) => state.pokemon);

  useEffect(() => {
    if (types.length === 0) {
      dispatch(fetchTypes());
    }
  }, [dispatch, types.length]);

  return {
    types,
    loading,
    error,
  };
};

