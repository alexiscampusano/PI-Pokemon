import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Home from './components/Home/Home';
import CreatePokemon from './components/CreatePokemon/CreatePokemon';
import PokemonDetails from './components/PokemonDetails/PokemonDetails';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pokemons" element={<Home />} />
        <Route path="/details/:id" element={<PokemonDetails />} />
        <Route path="/pokemon" element={<CreatePokemon />} />
      </Routes>
    </div>
  );
}

export default App;
