import db from '../src/models/index';

async function syncDatabase() {
  try {
    await db.sequelize.sync({ force: true });
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
}

syncDatabase();