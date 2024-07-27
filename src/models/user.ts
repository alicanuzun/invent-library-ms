import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { Borrow } from './borrow';

interface UserAttributes {
  id: number;
  name: string;
  created_dt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public created_dt!: Date;

  public static associate(models: any) {
    User.hasMany(models.Borrow, { foreignKey: 'user_id', as: 'borrows' });
  }
}

export default (sequelize: Sequelize) => {
  User.init(
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
      created_dt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(Date.now()),
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: false,
      name: {
        singular: 'user',
        plural: 'users',
      },
    }
  );
  // User.hasMany(Borrow,{foreignKey: 'user_id',as: 'borrows' });
  return User;
};
