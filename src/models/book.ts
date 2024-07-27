import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { Borrow } from './borrow';

interface BookAttributes {
  id: number;
  name: string;
  is_available: boolean;
  created_dt: Date;
}

interface BookCreationAttributes extends Optional<BookAttributes, 'id' | 'is_available' | 'created_dt'> {}

export class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
  public id!: number;
  public name!: string;
  public is_available!: boolean;
  public created_dt!: Date;

  public static associate(models: any) {
    Book.hasMany(models.Borrow, { foreignKey: 'book_id', as: 'borrows' });
  }
}

export default (sequelize: Sequelize) => {
  Book.init(
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
      is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_dt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(Date.now()),
      },
    },
    {
      sequelize,
      tableName: 'books',
      timestamps: false,
      name: {
        singular: 'book',
        plural: 'books',
      },
    }
  );
  // Book.hasMany(Borrow, { foreignKey: 'book_id',as: 'borrows' });
  return Book;
};
