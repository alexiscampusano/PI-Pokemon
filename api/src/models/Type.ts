import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

// Attributes interface
export interface TypeAttributes {
  id: number;
  name: string;
}

// Optional fields for creation
interface TypeCreationAttributes extends Optional<TypeAttributes, 'id'> {}

// Model class
export class Type extends Model<TypeAttributes, TypeCreationAttributes> implements TypeAttributes {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Model definition function
export default (sequelize: Sequelize): typeof Type => {
  Type.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'type',
      timestamps: true,
    }
  );

  return Type;
};
