import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { setFilters } from '../../../redux/pokemonSlice';
import { useAppDispatch } from '../../../redux/hooks';
import { useDebounce } from '../../../hooks';
import { getRoutes } from '../../../constants';
import { Pokemon } from '../../../types/api';
import { pokemonAPI } from '../../../services/api';
import styles from './SearchBar.module.css';

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Pokemon[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions from backend
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.trim().length >= 2) {
        setIsLoading(true);
        try {
          const response = await pokemonAPI.search(debouncedQuery);
          if (response.success && response.data) {
            setSuggestions(response.data);
            setShowSuggestions(response.data.length > 0);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
      setSelectedIndex(-1);
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (searchTerm.trim()) {
      dispatch(setFilters({ name: searchTerm.trim().toLowerCase(), page: 1 }));
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleSuggestionClick = (pokemon: Pokemon) => {
    navigate(getRoutes.pokemonDetails(pokemon.id));
    setQuery('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    dispatch(setFilters({ name: undefined, page: 1 }));
  };

  return (
    <div className={styles.searchWrapper} ref={wrapperRef}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search Pokemon (e.g., pikachu)..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
        />
        {query && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        <button type="submit" onClick={() => handleSearch()} disabled={!query.trim()}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className={styles.suggestionsDropdown}>
          <div className={styles.suggestionsHeader}>
            {isLoading ? 'Searching...' : `${suggestions.length} result${suggestions.length !== 1 ? 's' : ''}`}
          </div>
          <ul className={styles.suggestionsList}>
            {suggestions.map((pokemon, index) => (
              <li
                key={pokemon.id}
                className={`${styles.suggestionItem} ${
                  index === selectedIndex ? styles.selected : ''
                }`}
                onClick={() => handleSuggestionClick(pokemon)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className={styles.suggestionImage}
                />
                <div className={styles.suggestionInfo}>
                  <span className={styles.suggestionName}>
                    {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                  </span>
                  <span className={styles.suggestionTypes}>
                    {pokemon.types.map((t) => t.name).join(', ')}
                  </span>
                </div>
                <span className={styles.suggestionId}>#{pokemon.id}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSuggestions && !isLoading && query.length >= 2 && suggestions.length === 0 && (
        <div className={styles.suggestionsDropdown}>
          <div className={styles.noResults}>
            No Pokemon found for &quot;{query}&quot;
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
