import { config } from 'dotenv';
import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { Pokemon } from './models/Pokemon';
import { Type } from './models/Type';

config();

const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

if (!DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error('Missing database environment variables');
}

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});

const basename = path.basename(__filename);

// eslint-disable-next-line no-unused-vars
const modelDefiners: Array<(sequelize: Sequelize) => void> = [];

// Read all files from the Models folder
fs.readdirSync(path.join(__dirname, '/models'))
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.slice(-3) === '.ts' || file.slice(-3) === '.js') &&
      file.indexOf('.test.') === -1
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, '/models', file));
    modelDefiners.push(model.default || model);
  });

// Inject the connection (sequelize) to all models
modelDefiners.forEach((model) => model(sequelize));

// Capitalize model names ie: product => Product
const entries = Object.entries(sequelize.models);
const capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
// @ts-ignore - Sequelize models is readonly but we need to reassign
sequelize.models = Object.fromEntries(capsEntries);

// Get models from sequelize
const { Pokemon: PokemonModel, Type: TypeModel } = sequelize.models as {
  Pokemon: typeof Pokemon;
  Type: typeof Type;
};

// Define relationships
PokemonModel.belongsToMany(TypeModel, { through: 'pokemons_type' });
TypeModel.belongsToMany(PokemonModel, { through: 'pokemons_type' });

export { PokemonModel as Pokemon, TypeModel as Type, sequelize as conn };

export default sequelize;
