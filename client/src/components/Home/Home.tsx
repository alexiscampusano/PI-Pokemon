import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchPokemons,
  fetchTypes,
  setFilters,
  resetFilters,
  setPage,
} from '../../redux/pokemonSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PokemonCard from '../PokemonCard/PokemonCard';
import Paginated from '../Paginated/Paginated';
import SearchBar from '../SearchBar/SearchBar';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pokemons, types, loading, pagination, filters } = useAppSelector(
    (state) => state.pokemon
  );

  useEffect(() => {
    dispatch(fetchPokemons(filters));
    dispatch(fetchTypes());
  }, [dispatch, filters]);

  const handleReload = () => {
    dispatch(resetFilters());
  };

  const handleFilterType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value === 'All' ? undefined : e.target.value;
    dispatch(setFilters({ type, page: 1 }));
  };

  const handleFilterCreated = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let createdInDb: boolean | undefined;
    if (e.target.value === 'Created') {
      createdInDb = true;
    } else if (e.target.value === 'Existing') {
      createdInDb = false;
    } else {
      createdInDb = undefined;
    }
    dispatch(setFilters({ createdInDb, page: 1 }));
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'None') {
      dispatch(setFilters({ sortBy: undefined, order: undefined, page: 1 }));
    } else {
      const order = value === 'Asc' ? 'ASC' : 'DESC';
      dispatch(setFilters({ sortBy: 'name', order, page: 1 }));
    }
  };

  const handleOrderByAttack = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'None') {
      dispatch(setFilters({ sortBy: undefined, order: undefined, page: 1 }));
    } else {
      const order = value === 'Asc' ? 'ASC' : 'DESC';
      dispatch(setFilters({ sortBy: 'attack', order, page: 1 }));
    }
  };

  const handlePageChange = (pageNumber: number) => {
    dispatch(setPage(pageNumber));
  };

  return (
    <div className={styles.container}>
      <button>
        <Link to="/">Landing</Link>
      </button>
      <div className={styles.filters}>
        <label>By Types</label>
        <select onChange={handleFilterType} value={filters.type || 'All'}>
          <option value="All">All</option>
          {types?.map((type) => (
            <option key={type.id || type.name} value={type.name}>
              {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            </option>
          ))}
        </select>

        <label>By Origin</label>
        <select
          onChange={handleFilterCreated}
          value={
            filters.createdInDb === undefined ? 'All' : filters.createdInDb ? 'Created' : 'Existing'
          }
        >
          <option value="All">All</option>
          <option value="Created">Created</option>
          <option value="Existing">Existing</option>
        </select>

        <label>By Alphabetic Order</label>
        <select
          onChange={handleSort}
          value={filters.sortBy === 'name' ? (filters.order === 'ASC' ? 'Asc' : 'Desc') : 'None'}
        >
          <option value="None">None</option>
          <option value="Asc">A-Z</option>
          <option value="Desc">Z-A</option>
        </select>

        <label>By Power Order</label>
        <select
          onChange={handleOrderByAttack}
          value={filters.sortBy === 'attack' ? (filters.order === 'ASC' ? 'Asc' : 'Desc') : 'None'}
        >
          <option value="None">None</option>
          <option value="Asc">Power Min</option>
          <option value="Desc">Power Max</option>
        </select>

        <button onClick={handleReload}>Reset</button>

        <Paginated
          pokemonsPerPage={pagination.limit}
          allPokemons={pagination.total}
          paginated={handlePageChange}
          currentPage={pagination.page}
        />

        <Link to="/pokemon">Create Pokémon</Link>
        <SearchBar />

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className={styles.cards}>
            {pokemons?.map((pokemon) => (
              <div key={pokemon.id}>
                <PokemonCard
                  id={pokemon.id}
                  name={pokemon.name}
                  types={pokemon.types.map((t) => `[${t.name}]`)}
                  sprite={pokemon.sprite}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
