import { Link } from 'react-router-dom';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
  id: number | string;
  name: string;
  types: string[];
  sprite: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ id, name, types, sprite }) => {
  const idString = id.toString();
  const pokemonNumber = idString.length === 1 
    ? `N.° 00${id}` 
    : idString.length === 2 
    ? `N.° 0${id}` 
    : `N.° ${id}`;

  return (
    <div className={styles.container}>
      <Link className={styles.name} to={`/details/${id}`}>
        <h1>{name.toUpperCase()}</h1>
        <div>
          <div>{pokemonNumber}</div>
          <div>
            <img
              className={styles.pokeSprite}
              src={sprite}
              alt={name}
            />
          </div>
          <div className={styles.types}>
            {types?.map((type) => (
              <h5 key={type}>{type}</h5>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PokemonCard;

