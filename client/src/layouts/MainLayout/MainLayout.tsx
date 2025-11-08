import { ReactNode } from 'react';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>Pokémon App</h1>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>© 2024 Pokémon App - Built with React + TypeScript + Vite</p>
      </footer>
    </div>
  );
};

export default MainLayout;

