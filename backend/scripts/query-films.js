const { Client } = require('pg');
require('dotenv').config();

// Функция для запроса данных
async function queryFilms() {
  // Получаем строку подключения из переменных окружения или используем строку по умолчанию
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://film_user:afisha@localhost:5432/film_db';
  console.log(`Database URL: ${databaseUrl}`);

  const match = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    console.error('Invalid database URL format');
    return;
  }

  const [, user, password, host, port, database] = match;
  const client = new Client({
    user,
    host,
    database,
    password,
    port: parseInt(port, 10),
  });

  try {
    await client.connect();
    console.log('✅ Successfully connected to PostgreSQL!');

    // Выполняем запрос
    const filmsResult = await client.query('SELECT * FROM films');
    console.log('Films table data:');
    console.log(JSON.stringify(filmsResult.rows, null, 2));

    // Выполняем запрос расписания
    const schedulesResult = await client.query('SELECT * FROM schedules');
    console.log('Schedules table data:');
    console.log(JSON.stringify(schedulesResult.rows, null, 2));
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    // Закрываем соединение
    await client.end();
  }
}

queryFilms().catch(console.error);
