import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPokemonDetails, cleanDetails } from '../../redux/pokemonSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import Loading from '../Loading/Loading';
import styles from './PokemonDetails.module.css';

const PokemonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { details, loading } = useAppSelector((state) => state.pokemon);

  useEffect(() => {
    if (id) {
      dispatch(fetchPokemonDetails(id));
    }
    return () => {
      dispatch(cleanDetails());
    };
  }, [id, dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.details}>
      {details ? (
        <div className={styles.pokeDetail}>
          <h6>{details.id}</h6>
          <h1>{details.name}</h1>
          <div>
            <img src={details.sprite} alt={details.name} />
            <hr />
            <h1>Types</h1>
            {details.types?.map((type) => (
              <span key={type.name}>{type.name} </span>
            ))}
            <hr />
            <div>
              <h1>Statistics</h1>
              <h4>HP: {details.hp}</h4>
              <h4>Attack: {details.attack}</h4>
              <h4>Defense: {details.defense}</h4>
              <h4>Speed: {details.speed}</h4>
            </div>
            <hr />
            <h3>Height: {details.height}</h3>
            <h3>Weight: {details.weight}</h3>
          </div>
        </div>
      ) : (
        <Loading />
      )}
      <Link to="/pokemons">
        <button>Back</button>
      </Link>
    </div>
  );
};

export default PokemonDetails;

