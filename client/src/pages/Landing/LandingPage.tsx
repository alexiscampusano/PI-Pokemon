import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import styles from './LandingPage.module.css';

const LandingPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Gotta Catch 'Em All</h1>
      <Link to={ROUTES.HOME}>
        <button>Enter</button>
      </Link>
    </div>
  );
};

export default LandingPage;
