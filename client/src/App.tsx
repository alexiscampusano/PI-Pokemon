import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts';
import { Landing, Home, CreatePokemon, PokemonDetails } from './pages';
import { ROUTES } from './constants';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={ROUTES.LANDING} element={<Landing />} />
        <Route
          path={ROUTES.HOME}
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.POKEMON_DETAILS}
          element={
            <MainLayout>
              <PokemonDetails />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.CREATE_POKEMON}
          element={
            <MainLayout>
              <CreatePokemon />
            </MainLayout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
