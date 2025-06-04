const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  // Берем параметры из .env файла
  console.log('Database URL:', process.env.DATABASE_URL);
  console.log('Username:', process.env.DATABASE_USERNAME);
  console.log('Password length:', process.env.DATABASE_PASSWORD ? process.env.DATABASE_PASSWORD.length : 'undefined');

  let dbConfig = {};

  // Обрабатываем случай, когда используем URL вида postgres://localhost:5432/film_db
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres://')) {
    const url = new URL(process.env.DATABASE_URL);
    dbConfig = {
      host: url.hostname,
      port: url.port || 5432,
      database: url.pathname.substring(1), // убираем начальный слэш
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD
    };
    console.log('Parsed connection details:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user
    });
  } else {
    // Используем строку подключения напрямую
    dbConfig = {
      connectionString: process.env.DATABASE_URL,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD
    };
  }

  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('✅ Successfully connected to PostgreSQL!');

    // Проверяем права доступа к схеме public
    const schemaResult = await client.query(`
      SELECT has_schema_privilege(current_user, 'public', 'create') AS can_create, has_schema_privilege(current_user, 'public', 'usage') AS can_use
    `);

    console.log('Schema privileges:', schemaResult.rows[0]);

    // Проверяем существование таблиц
    const tablesResult = await client.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
    `);

    console.log('Existing tables:', tablesResult.rows.map(row => row.tablename));

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);

      // Выводим понятное описание для распространенных ошибок
      if (error.code === '28P01') {
        console.error('Authentication failed - incorrect username or password');
      } else if (error.code === '3D000') {
        console.error('Database does not exist');
      } else if (error.code === '42501') {
        console.error('Permission denied - insufficient privileges');
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        console.error('Could not connect to server - check hostname and port');
      }
    }
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (e) {
        console.error('Error closing connection:', e.message);
      }
    }
  }
}

testConnection();
