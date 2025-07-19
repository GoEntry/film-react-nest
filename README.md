# FILM!

### Ссылка
film-goentry.nomorepartiessbs.ru

## Установка

### MongoDB

Установите MongoDB скачав дистрибутив с официального сайта или с помощью пакетного менеджера вашей ОС. Также можно воспользоваться Docker (см. ветку `feat/docker`.

Выполните скрипт `test/mongodb_initial_stub.js` в консоли `mongo`.

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

* `DATABASE_DRIVER` - тип драйвера СУБД - в нашем случае это `mongodb` 
* `DATABASE_URL` - адрес СУБД MongoDB, например `mongodb://127.0.0.1:27017/practicum`.  

MongoDB должна быть установлена и запущена.

Запустите бэкенд:
`npm start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.


# Film App - React + Nest.js

Приложение для просмотра информации о фильмах с использованием React на фронтенде и Nest.js на бэкенде.

## Структура проекта

- `frontend/` - React приложение
- `backend/` - Nest.js API
- `nginx/` - Nginx конфигурация
- `postgres-init-scripts/` - SQL скрипты для инициализации базы данных

## Локальная разработка

Для локальной разработки используйте:

```bash
docker compose up -d
```

## Переменные окружения

Создайте файл `.env` в корневой директории проекта со следующими переменными:

```
OWNER=your-github-username
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
DB_SCHEMA=public
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin
```

## Доступ к приложению

- Веб-приложение: http://localhost
- PgAdmin: http://localhost:8080




