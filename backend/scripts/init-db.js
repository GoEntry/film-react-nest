const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  // Разбираем строку подключения
  let dbConfig = {};

  // Обрабатываем случай, когда используем URL вида postgres://localhost:5432/film_db
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres://')) {
    const url = new URL(process.env.DATABASE_URL);
    dbConfig = {
      host: url.hostname,
      port: url.port || 5432,
      database: url.pathname.substring(1),
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD
    };
    console.log('Using parsed connection details:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user
    });
  } else {
    dbConfig = {
      connectionString: process.env.DATABASE_URL,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD
    };
  }

  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');

    // Сначала удаляем существующие данные для избежания конфликтов
    console.log('Cleaning existing data...');
    await client.query('DELETE FROM schedules');
    await client.query('DELETE FROM films');
    console.log('Existing data cleaned successfully');

    // Выполняем инициализацию таблиц
    console.log('Creating tables...');
    const initSql = fs.readFileSync(path.join(__dirname, '../test/prac.init.sql'), 'utf8');
    await client.query(initSql);
    console.log('Tables created successfully');

    // Заполняем таблицу фильмов
    console.log('Inserting film data...');
    const filmsSql = fs.readFileSync(path.join(__dirname, '../test/prac.films.sql'), 'utf8');
    await client.query(filmsSql);
    console.log('Films data inserted successfully');

    // Заполняем таблицу расписания
    console.log('Inserting schedule data...');
    const schedulesSql = fs.readFileSync(path.join(__dirname, '../test/prac.shedules.sql'), 'utf8');
    await client.query(schedulesSql);
    console.log('Schedules data inserted successfully');

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.detail) {
      console.error('Error detail:', error.detail);
    }
    if (error.position) {
      console.error('Error position:', error.position);
    }
  } finally {
    try {
      await client.end();
    } catch (e) {
      console.error('Error closing connection:', e.message);
    }
  }
}

initializeDatabase();
