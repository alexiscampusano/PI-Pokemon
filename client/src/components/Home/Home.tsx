import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchAllPokemons,
  fetchTypes,
  filterByType,
  filterByCreated,
  orderByName,
  orderByAttack,
} from '../../redux/pokemonSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PokemonCard from '../PokemonCard/PokemonCard';
import Paginated from '../Paginated/Paginated';
import SearchBar from '../SearchBar/SearchBar';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pokemons, types, loading } = useAppSelector((state) => state.pokemon);

  // Paginado
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pokemonsPerPage = 12;

  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = pokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);

  const paginated = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(fetchAllPokemons());
    dispatch(fetchTypes());
  }, [dispatch]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(fetchAllPokemons());
    setCurrentPage(1);
  };

  const handleFilterType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(filterByType(e.target.value));
    setCurrentPage(1);
  };

  const handleFilterCreated = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(filterByCreated(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value as 'Asc' | 'Desc';
    dispatch(orderByName(value));
    setCurrentPage(1);
  };

  const handleOrderByAttack = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value as 'Asc' | 'Desc';
    dispatch(orderByAttack(value));
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <button>
        <Link to="/">Landing</Link>
      </button>
      <div className={styles.filters}>
        <label>By Types</label>
        <select onChange={handleFilterType}>
          <option value="All">All</option>
          {types?.map((type) => (
            <option key={type.id} value={type.name}>
              {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            </option>
          ))}
        </select>

        <label>By Origin</label>
        <select onChange={handleFilterCreated}>
          <option value="All">All</option>
          <option value="Created">Created</option>
          <option value="api">Existing</option>
        </select>

        <label>By Alphabetic Order</label>
        <select onChange={handleSort}>
          <option value="None" hidden>
            None
          </option>
          <option value="Asc">A-Z</option>
          <option value="Desc">Z-A</option>
        </select>

        <label>By Power Order</label>
        <select onChange={handleOrderByAttack}>
          <option value="None" hidden>
            None
          </option>
          <option value="Asc">Power Min</option>
          <option value="Desc">Power Max</option>
        </select>

        <button onClick={handleClick}>Reset</button>

        <Paginated
          pokemonsPerPage={pokemonsPerPage}
          allPokemons={pokemons.length}
          paginated={paginated}
        />

        <Link to="/pokemon">Create Pokémon</Link>
        <SearchBar />

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className={styles.cards}>
            {currentPokemons?.map((pokemon) => (
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

