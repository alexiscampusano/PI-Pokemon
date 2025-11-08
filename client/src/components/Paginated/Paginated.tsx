import styles from './Paginated.module.css';

interface PaginatedProps {
  pokemonsPerPage: number;
  allPokemons: number;
  paginated: (pageNumber: number) => void;
  currentPage?: number;
}

const Paginated: React.FC<PaginatedProps> = ({
  pokemonsPerPage,
  allPokemons,
  paginated,
  currentPage = 1,
}) => {
  const pageNumbers: number[] = [];
  const totalPages = Math.ceil(allPokemons / pokemonsPerPage);

  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i + 1);
  }

  return (
    <nav>
      <ul className={styles.paginated}>
        {pageNumbers?.map((number) => (
          <li
            className={`${styles.number} ${currentPage === number ? styles.active : ''}`}
            key={number}
          >
            <a onClick={() => paginated(number)}>{number}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Paginated;
