-- Создание пользователя для работы с базой данных
CREATE USER film_user WITH PASSWORD 'film_password';

-- Создание основной базы данных для приложения
CREATE DATABASE film_project;

-- Предоставление всех привилегий на базу данных пользователю (необходимо для полноценной работы приложения с базой данных)
GRANT ALL PRIVILEGES ON DATABASE film_project TO film_user; 