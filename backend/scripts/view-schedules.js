const { Client } = require('pg');
require('dotenv').config();

// Функция для запроса данных
async function viewSchedules() {
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

    // Запрашиваем только расписания для первого фильма для анализа
    const filmId = '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf'; // ID фильма "Архитекторы общества"
    const result = await client.query('SELECT * FROM schedules WHERE film_id = $1', [filmId]);

    console.log(`Schedules for film ${filmId} (${result.rows.length} records):`);
    console.log(JSON.stringify(result.rows, null, 2));

    // Проверяем формат daytime
    if (result.rows.length > 0) {
      console.log('\nAnalysis of daytime field:');
      const sample = result.rows[0].daytime;
      console.log(`Sample daytime: "${sample}"`);
      console.log(`Type: ${typeof sample}`);
      console.log(`Valid Date object: ${!isNaN(new Date(sample).getTime())}`);

      // Проверяем с dayjs (для имитации фронтенда)
      const dayjs = require('dayjs');
      const parsedDaytime = dayjs(sample);
      console.log(`dayjs valid: ${parsedDaytime.isValid()}`);
      console.log(`dayjs format: ${parsedDaytime.format('D MMMM HH:mm')}`);
    }
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await client.end();
  }
}

viewSchedules().catch(console.error);
