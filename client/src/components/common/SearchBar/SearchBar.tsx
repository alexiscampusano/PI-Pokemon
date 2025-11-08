import { useState } from 'react';
import { setFilters } from '../../../redux/pokemonSlice';
import { useAppDispatch } from '../../../redux/hooks';
import styles from './SearchBar.module.css';

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(setFilters({ name: name.trim().toLowerCase(), page: 1 }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && name.trim()) {
      dispatch(setFilters({ name: name.trim().toLowerCase(), page: 1 }));
    }
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Pokemon name..."
        value={name}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <button type="submit" onClick={handleSubmit}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
