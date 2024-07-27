import { Sequelize, DataTypes } from 'sequelize';
import { readdirSync } from 'fs';
import { join, basename as _basename } from 'path';

const basename = _basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(join(__dirname, '../../config/config.json'))[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

const db: any = {};

const importModel = async (file: string) => {
  const model = (await import(join(__dirname, file))).default(sequelize, DataTypes);
  db[model.name] = model;
};

const initializeModels = async () => {
  const files = readdirSync(__dirname).filter(
    (file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts'
  );

  await Promise.all(files.map(importModel));

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

initializeModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
