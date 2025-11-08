import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

// Attributes interface
export interface PokemonAttributes {
  id: string;
  name: string;
  hp?: number;
  attack?: number;
  defense?: number;
  speed?: number;
  height?: number;
  weight?: number;
  sprite?: string;
  createdInDb: boolean;
}

// Optional fields for creation
interface PokemonCreationAttributes
  extends Optional<PokemonAttributes, 'id' | 'sprite' | 'createdInDb'> {}

// Model class
export class Pokemon
  extends Model<PokemonAttributes, PokemonCreationAttributes>
  implements PokemonAttributes
{
  public id!: string;
  public name!: string;
  public hp?: number;
  public attack?: number;
  public defense?: number;
  public speed?: number;
  public height?: number;
  public weight?: number;
  public sprite?: string;
  public createdInDb!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Model definition function
export default (sequelize: Sequelize): typeof Pokemon => {
  Pokemon.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      attack: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      defense: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      speed: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sprite: {
        type: DataTypes.STRING,
        defaultValue:
          'https://imagenpng.com/wp-content/uploads/2016/09/Pokebola-pokeball-png-0.png',
      },
      createdInDb: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'pokemon',
      timestamps: true,
    }
  );

  return Pokemon;
};
