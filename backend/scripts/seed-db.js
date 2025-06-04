const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Читаем данные из файла
const data = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../test/mongodb_initial_stub.json'),
    'utf8',
  ),
);

// Подключаемся к MongoDB
async function seedDatabase() {
  try {
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();

    console.log('Connected to MongoDB');

    const db = client.db('film');
    const filmsCollection = db.collection('films');

    // Удаляем старые данные
    await filmsCollection.deleteMany({});
    console.log('Previous data deleted');

    // Вставляем новые данные
    const result = await filmsCollection.insertMany(data);
    console.log(`${result.insertedCount} documents were inserted`);

    await client.close();
    console.log('Done');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
