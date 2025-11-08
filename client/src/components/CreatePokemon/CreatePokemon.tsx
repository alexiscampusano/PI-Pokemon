import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPokemon, fetchTypes, CreatePokemonPayload } from '../../redux/pokemonSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import styles from './CreatePokemon.module.css';

interface FormInput {
  name: string;
  hp: string;
  attack: string;
  defense: string;
  speed: string;
  weight: string;
  height: string;
  types: string[];
}

interface ValidationErrors {
  name?: string;
  hp?: string;
  attack?: string;
  defense?: string;
  speed?: string;
  weight?: string;
  height?: string;
  types?: string;
}

const validate = (input: FormInput): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!input.name) {
    errors.name = 'Name is required';
  } else if (Number(input.hp) > 255 || !input.hp) {
    errors.hp = 'HP is required and must be less than 255';
  } else if (Number(input.attack) > 255 || !input.attack) {
    errors.attack = 'Attack is required and must be less than 255';
  } else if (Number(input.defense) > 255 || !input.defense) {
    errors.defense = 'Defense is required and must be less than 255';
  } else if (Number(input.speed) > 255 || !input.speed) {
    errors.speed = 'Speed is required and must be less than 255';
  } else if (!input.weight) {
    errors.weight = 'Weight is required';
  } else if (!input.height) {
    errors.height = 'Height is required';
  } else if (input.types.length === 0) {
    errors.types = 'At least one type is required';
  }
  return errors;
};

const CreatePokemon: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { types } = useAppSelector((state) => state.pokemon);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [input, setInput] = useState<FormInput>({
    name: '',
    hp: '',
    attack: '',
    defense: '',
    speed: '',
    weight: '',
    height: '',
    types: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    setErrors(
      validate({
        ...input,
        [e.target.name]: e.target.value,
      })
    );
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== 'DEFAULT' && !input.types.includes(e.target.value)) {
      setInput({
        ...input,
        types: [...input.types, e.target.value],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(input);

    if (Object.keys(validationErrors).length === 0) {
      const pokemonData: CreatePokemonPayload = {
        name: input.name,
        hp: Number(input.hp),
        attack: Number(input.attack),
        defense: Number(input.defense),
        speed: Number(input.speed),
        weight: Number(input.weight),
        height: Number(input.height),
        types: input.types,
      };

      dispatch(createPokemon(pokemonData));
      alert('Pokemon created successfully!');
      navigate('/pokemons');
      setInput({
        name: '',
        hp: '',
        attack: '',
        defense: '',
        speed: '',
        weight: '',
        height: '',
        types: [],
      });
    } else {
      setErrors(validationErrors);
      alert('Please fix the errors in the form');
    }
  };

  const handleDelete = (typeToDelete: string) => {
    setInput({
      ...input,
      types: input.types.filter((type) => type !== typeToDelete),
    });
  };

  useEffect(() => {
    dispatch(fetchTypes());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <Link to="/pokemons">
        <button>Back</button>
      </Link>
      <h1>Create Pokemon!</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={input.name} name="name" onChange={handleChange} />
          {errors.name && <p>{errors.name}</p>}
        </div>
        <div>
          <label>HP:</label>
          <input
            type="number"
            value={input.hp}
            name="hp"
            min="0"
            max="255"
            onChange={handleChange}
          />
          {errors.hp && <p>{errors.hp}</p>}
        </div>
        <div>
          <label>Attack:</label>
          <input
            type="number"
            value={input.attack}
            name="attack"
            min="0"
            max="255"
            onChange={handleChange}
          />
          {errors.attack && <p>{errors.attack}</p>}
        </div>
        <div>
          <label>Defense:</label>
          <input
            type="number"
            value={input.defense}
            name="defense"
            min="0"
            max="255"
            onChange={handleChange}
          />
          {errors.defense && <p>{errors.defense}</p>}
        </div>
        <div>
          <label>Speed:</label>
          <input
            type="number"
            value={input.speed}
            name="speed"
            min="0"
            max="255"
            onChange={handleChange}
          />
          {errors.speed && <p>{errors.speed}</p>}
        </div>
        <div>
          <label>Weight:</label>
          <input type="number" value={input.weight} name="weight" min="0" onChange={handleChange} />
          {errors.weight && <p>{errors.weight}</p>}
        </div>
        <div>
          <label>Height:</label>
          <input type="number" value={input.height} name="height" min="0" onChange={handleChange} />
          {errors.height && <p>{errors.height}</p>}
        </div>

        <div>
          <label>Types:</label>
          <select value="DEFAULT" onChange={handleSelect}>
            <option value="DEFAULT">Select Type</option>
            {types?.map((type, i) => (
              <option key={i} value={type.name}>
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
              </option>
            ))}
          </select>
          {errors.types && <p>{errors.types}</p>}
        </div>

        <div className={styles.typesContainer}>
          {input.types?.map((type, i) => (
            <div key={i} className={styles.typeTag}>
              <span>{type}</span>
              <button type="button" onClick={() => handleDelete(type)}>
                X
              </button>
            </div>
          ))}
        </div>

        <button type="submit">Create Now!</button>
      </form>
    </div>
  );
};

export default CreatePokemon;
