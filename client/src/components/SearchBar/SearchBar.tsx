import { useState } from 'react';
import { fetchPokemonByName } from '../../redux/pokemonSlice';
import { useAppDispatch } from '../../redux/hooks';
import styles from './SearchBar.module.css';

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(fetchPokemonByName(name.toLowerCase()));
    }
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Pokemon name..."
        value={name}
        onChange={handleInputChange}
      />
      <button type="submit" onClick={handleSubmit}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;

