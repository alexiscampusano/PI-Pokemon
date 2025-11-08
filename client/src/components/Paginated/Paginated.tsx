import styles from './Paginated.module.css';

interface PaginatedProps {
  pokemonsPerPage: number;
  allPokemons: number;
  paginated: (pageNumber: number) => void;
}

const Paginated: React.FC<PaginatedProps> = ({ pokemonsPerPage, allPokemons, paginated }) => {
  const pageNumbers: number[] = [];

  for (let i = 0; i < Math.ceil(allPokemons / pokemonsPerPage); i++) {
    pageNumbers.push(i + 1);
  }

  return (
    <nav>
      <ul className={styles.paginated}>
        {pageNumbers?.map((number) => (
          <li className={styles.number} key={number}>
            <a onClick={() => paginated(number)}>{number}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Paginated;

