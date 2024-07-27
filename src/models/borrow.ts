import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { User } from './user';
import { Book } from './book';

interface BorrowAttributes {
  id: number;
  user_id: number;
  book_id: number;
  borrow_date: Date;
  return_date?: Date;
  score?: number;
}

interface BorrowCreationAttributes extends Optional<BorrowAttributes, 'id' | 'borrow_date' | 'return_date'> {}

export class Borrow extends Model<BorrowAttributes, BorrowCreationAttributes> implements BorrowAttributes {
  public id!: number;
  public user_id!: number;
  public book_id!: number;
  public borrow_date!: Date;
  public return_date?: Date;
  public score?: number;

  public static associate(models: any) {
    Borrow.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Borrow.belongsTo(models.Book, { foreignKey: 'book_id', as: 'book' });
  }
}


export default (sequelize: Sequelize) => {
  Borrow.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'books',
          key: 'id',
        },
      },
      borrow_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(Date.now()),
      },
      return_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'borrows',
      timestamps: false,
      name: {
        singular: 'borrow',
        plural: 'borrows',
      },
    }
  );
  // Borrow.belongsTo(User, { foreignKey: 'user_id', as:"users" });
  // Borrow.belongsTo(Books, { foreignKey: 'book_id', as:"books" });
  return Borrow;
};
