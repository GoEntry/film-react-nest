# Инструкция по развертыванию приложения на сервере

## 1. Установка Docker и Docker Compose

```bash
# Обновляем пакеты
sudo apt update

# Устанавливаем необходимые пакеты
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Добавляем GPG ключ Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Добавляем репозиторий Docker
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Обновляем пакеты
sudo apt update

# Устанавливаем Docker
sudo apt install -y docker-ce

# Добавляем текущего пользователя в группу docker
sudo usermod -aG docker ${USER}

# Устанавливаем Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Проверяем установку
docker --version
docker-compose --version
```

## 2. Создание директории для проекта и настройка файлов

```bash
# Создаем директорию для проекта
mkdir -p ~/film-app
cd ~/film-app

# Создаем файл .env
cat > .env << EOL
OWNER=goentry
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
DB_SCHEMA=public
PGADMIN_DEFAULT_EMAIL=admin@filmapp.org
PGADMIN_DEFAULT_PASSWORD=admin
EOL

# Создаем директорию для конфигурации Nginx
mkdir -p nginx
```

## 3. Создание конфигурационного файла Nginx

```bash
# Создаем файл конфигурации Nginx
cat > nginx/nginx.conf << EOL
server {
    listen 80 default_server;
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log debug;

    location ~ ^/(api|content)/{
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        index index.html index.htm;
    }
}
EOL
```

## 4. Создание файла docker-compose.yml

```bash
# Создаем файл docker-compose.yml
cat > docker-compose.yml << EOL
services:
  database:
    image: postgres:16.4
    command: postgres
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - internal
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin4_container
    restart: always
    ports:
      - "8080:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: \${PGADMIN_DEFAULT_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: \${PGADMIN_DEFAULT_PASSWORD}
    volumes:
      - pgadmin-data:/var/lib/pgadmin
    networks:
      - internal

  backend:
    image: ghcr.io/\${OWNER}/backend:latest
    environment:
      PORT: 3000
      DATABASE_HOST: database
      DATABASE_PORT: 5432
      DATABASE_USERNAME: film_user
      DATABASE_PASSWORD: film_password
      DATABASE_NAME: film_project
      DATABASE_SCHEMA: \${DB_SCHEMA}
    networks:
      - internal
    depends_on:
      database:
        condition: service_healthy

  frontend:
    image: ghcr.io/\${OWNER}/frontend:latest
    networks:
      - internal
    depends_on:
      - backend
    ports:
      - "3001:80"

  server:
    image: ghcr.io/\${OWNER}/server:latest
    ports:
      - 80:80
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - backend
      - frontend
    networks:
      - internal

volumes:
  db_data:
  pgadmin-data:

networks:
  internal:
EOL
```

## 5. Запуск приложения

```bash
# Запускаем приложение
docker-compose up -d

# Проверяем статус контейнеров
docker-compose ps
```

## 6. Настройка базы данных через pgAdmin

1. Откройте браузер и перейдите по адресу `http://your_server_ip:8080`
2. Войдите в pgAdmin, используя учетные данные из файла `.env`:
   - Email: `admin@filmapp.org`
   - Пароль: `admin`

3. Добавьте новый сервер:
   - Имя: `film-database`
   - Вкладка Connection:
     - Host: `database`
     - Port: `5432`
     - Maintenance database: `postgres`
     - Username: `postgres`
     - Password: `postgres`

4. Создайте новую базу данных:
   - Имя: `film_project`
   - Владелец: `postgres`

5. Создайте пользователя:
   - Имя: `film_user`
   - Пароль: `film_password`
   - Привилегии: все необходимые для работы с базой данных

## 7. Загрузка SQL-файлов

```bash
# Создаем директорию для SQL-файлов
mkdir -p ~/film-app/sql
cd ~/film-app/sql

# Создаем файл prac.init.sql
cat > prac.init.sql << EOL
CREATE TABLE IF NOT EXISTS films (
  id VARCHAR(50) PRIMARY KEY,
  rating NUMERIC NOT NULL,
  director VARCHAR(255) NOT NULL,
  tags VARCHAR[] NOT NULL,
  title VARCHAR(255) NOT NULL,
  about TEXT NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NOT NULL,
  cover VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS schedules (
  id VARCHAR(50) PRIMARY KEY,
  daytime VARCHAR(50) NOT NULL,
  hall VARCHAR(50) NOT NULL,
  rows INTEGER NOT NULL,
  seats INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  taken VARCHAR[] DEFAULT '{}',
  film_id VARCHAR(50) NOT NULL REFERENCES films(id) ON DELETE CASCADE
);
EOL

# Создаем файл prac.films.sql
cat > prac.films.sql << EOL
-- Заполнение таблицы фильмов данными из MongoDB
INSERT INTO films (id, rating, director, tags, title, about, description, image, cover) VALUES
('0e33c7f6-27a7-4aa0-8e61-65d7e5effecf', 2.9, 'Итан Райт', ARRAY['Документальный'], 'Архитекторы общества', 'Документальный фильм, исследующий влияние искусственного интеллекта на общество и этические, философские и социальные последствия технологии.', 'Документальный фильм Итана Райта исследует влияние технологий на современное общество, уделяя особое внимание роли искусственного интеллекта в формировании нашего будущего. Фильм исследует этические, философские и социальные последствия гонки технологий ИИ и поднимает вопрос: какой мир мы создаём для будущих поколений.', '/bg1s.jpg', '/bg1c.jpg'),
('51b4bc85-646d-47fc-b988-3e7051a9fe9e', 9.0, 'Харрисон Рид', ARRAY['Рекомендуемые'], 'Недостижимая утопия', 'Провокационный фильм-антиутопия, исследующий темы свободы, контроля и цены совершенства.', 'Провокационный фильм-антиутопия режиссера Харрисона Рида. Действие фильма разворачивается в, казалось бы, идеальном обществе, и рассказывает о группе граждан, которые начинают подвергать сомнению систему. Фильм исследует темы свободы, контроля и цены совершенства.', '/bg3s.jpg', '/bg3c.jpg'),
('3bedbc5a-844b-40eb-9d77-83b104e0cf75', 8.5, 'Элиза Уиттакер', ARRAY['Рекомендуемые'], 'Звёздное путешествие', 'Научно-фантастический фильм о команде астронавтов, исследующий темы жизнестойкости, надежды и силы человеческих связей', '«Звёздное путешествие» — прекрасный научно-фантастический фильм о команде астронавтов, путешествующих по галактике в поисках нового дома для человечества. Помимо потрясающей работы оператора и специалистов по визуальным эффектам, можно отметить темы, исследуемые в фильме: жизнестойкости, надежды и силы человеческих связей.', '/bg5s.jpg', '/bg5c.jpg'),
('5b70cb1a-61c9-47b1-b207-31f9e89087ff', 8.9, 'Лила Васкес', ARRAY['Рекомендуемые'], 'Стражи Гримуара', 'Фэнтезийное приключение об истинном значении дружбы, мужества и силы знаний', 'Захватывающее фэнтезийное приключение, которое рассказывает о группе героев, которые должны защитить древний магический том от попадания в руки тёмного колдуна. История об истинном значении дружбы, мужества и силы знаний.', '/bg2s.jpg', '/bg2c.jpg'),
('0354a762-8928-427f-81d7-1656f717f39c', 9.5, 'Оливер Беннет', ARRAY['Рекомендуемые'], 'Парадокс Нексуса', 'Фильм об эксперименте по соединению человеческих умов. Исследует вопросы неприкосновенности частной жизни, идентичности и самой природы человеческого сознания', 'В фильме исследуются последствия новаторского эксперимента по соединению человеческих умов. По мере развития проекта участники сталкиваются с вопросами неприкосновенности частной жизни, идентичности и самой природы человеческого сознания.', '/bg4s.jpg', '/bg4c.jpg'),
('92b8a2a7-ab6b-4fa9-915b-d27945865e39', 8.1, 'Амелия Хьюз', ARRAY['Рекомендуемые'], 'Сон в летний день', 'Фэнтези-фильм о группе друзей попавших в волшебный лес, где время остановилось.', 'Причудливый фэнтези-фильм, действие которого происходит в волшебном лесу, где время остановилось. Группа друзей натыкается на это заколдованное царство и поначалу проникается беззаботным духом обитателей, но потом друзьям приходится разойтись. А как встретиться снова, если нет ни времени, ни места встречи?', '/bg6s.jpg', '/bg6c.jpg');
EOL

# Создаем файл prac.schedules.sql
cat > prac.schedules.sql << EOL
-- Заполнение таблицы расписания сеансов данными из MongoDB
-- Расписание для фильма "Архитекторы общества"
INSERT INTO schedules (id, daytime, hall, rows, seats, price, taken, film_id) VALUES
('f2e429b0-685d-41f8-a8cd-1d8cb63b99ce', '10:00', '0', 5, 10, 350.00, ARRAY[]::VARCHAR[], '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf'),
('5beec101-acbb-4158-adc6-d855716b44a8', '14:00', '1', 5, 10, 350.00, ARRAY[]::VARCHAR[], '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf'),
('89ee32f3-8164-40a6-b237-f4d492450250', '16:00', '2', 5, 10, 350.00, ARRAY[]::VARCHAR[], '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf');

-- Расписание для фильма "Недостижимая утопия"
INSERT INTO schedules (id, daytime, hall, rows, seats, price, taken, film_id) VALUES
('9647fcf2-d0fa-4e69-ad90-2b23cff15449', '10:00', '0', 5, 10, 350.00, ARRAY[]::VARCHAR[], '51b4bc85-646d-47fc-b988-3e7051a9fe9e'),
('9f2db237-01d0-463e-a150-89f30bfc4250', '14:00', '1', 5, 10, 350.00, ARRAY[]::VARCHAR[], '51b4bc85-646d-47fc-b988-3e7051a9fe9e'),
('3d5f5d12-b4d8-44d3-a440-1b91616fda40', '16:00', '2', 5, 10, 350.00, ARRAY[]::VARCHAR[], '51b4bc85-646d-47fc-b988-3e7051a9fe9e');

-- Расписание для фильма "Звёздное путешествие"
INSERT INTO schedules (id, daytime, hall, rows, seats, price, taken, film_id) VALUES
('351b437c-3430-4a35-b71d-b93b3d80274a', '10:00', '0', 5, 10, 350.00, ARRAY[]::VARCHAR[], '3bedbc5a-844b-40eb-9d77-83b104e0cf75'),
('2661b7e2-7654-4d17-aa5d-9da76e4fb563', '14:00', '1', 5, 10, 350.00, ARRAY[]::VARCHAR[], '3bedbc5a-844b-40eb-9d77-83b104e0cf75'),
('d155ff3f-d547-4e4d-a530-bfcdcb3efbd5', '16:00', '2', 5, 10, 350.00, ARRAY[]::VARCHAR[], '3bedbc5a-844b-40eb-9d77-83b104e0cf75');

-- Расписание для фильма "Стражи Гримуара"
INSERT INTO schedules (id, daytime, hall, rows, seats, price, taken, film_id) VALUES
('793009d6-030c-4dd4-8d13-9ba500724b38', '10:00', '0', 5, 10, 350.00, ARRAY['3:3', '1:4', '1:5', '1:3', '1:2']::VARCHAR[], '5b70cb1a-61c9-47b1-b207-31f9e89087ff'),
('27a6c145-d5bf-4722-8bd9-b58c5b6b718f', '14:00', '1', 5, 10, 350.00, ARRAY[]::VARCHAR[], '5b70cb1a-61c9-47b1-b207-31f9e89087ff'),
('1f57131e-eb9c-41a2-b451-89ea7f691fb7', '16:00', '2', 5, 10, 350.00, ARRAY[]::VARCHAR[], '5b70cb1a-61c9-47b1-b207-31f9e89087ff');

-- Расписание для фильма "Парадокс Нексуса"
INSERT INTO schedules (id, daytime, hall, rows, seats, price, taken, film_id) VALUES
('d3f54ca3-8e19-4b63-afd4-6a8d03933339', '10:00', '0', 5, 10, 350.00, ARRAY[]::VARCHAR[], '0354a762-8928-427f-81d7-1656f717f39c'),
('2d794723-eadc-43ea-b82b-268f0178fb43', '14:00', '1', 5, 10, 350.00, ARRAY[]::VARCHAR[], '0354a762-8928-427f-81d7-1656f717f39c'),
('043eb8fb-454a-40d2-9ce9-6fe80072bf8b', '16:00', '2', 5, 10, 350.00, ARRAY[]::VARCHAR[], '0354a762-8928-427f-81d7-1656f717f39c');

-- Расписание для фильма "Сон в летний день"
INSERT INTO schedules (id, daytime, hall, rows, seats, price, taken, film_id) VALUES
('5274c89d-f39c-40f9-bea8-f22a22a50c8a', '10:00', '0', 5, 10, 350.00, ARRAY[]::VARCHAR[], '92b8a2a7-ab6b-4fa9-915b-d27945865e39'),
('3f7ed030-230c-4b06-bfc7-eeaee7f3f79b', '14:00', '1', 5, 10, 350.00, ARRAY[]::VARCHAR[], '92b8a2a7-ab6b-4fa9-915b-d27945865e39'),
('8e8c2627-4578-42b1-a59a-9ec4964a03e1', '16:00', '2', 5, 10, 350.00, ARRAY[]::VARCHAR[], '92b8a2a7-ab6b-4fa9-915b-d27945865e39');
EOL
```

## 8. Выполнение SQL-файлов

```bash
# Копируем SQL-файлы в контейнер PostgreSQL
docker cp ~/film-app/sql/prac.init.sql $(docker-compose ps -q database):/tmp/
docker cp ~/film-app/sql/prac.films.sql $(docker-compose ps -q database):/tmp/
docker cp ~/film-app/sql/prac.schedules.sql $(docker-compose ps -q database):/tmp/

# Выполняем SQL-файлы
docker-compose exec database psql -U postgres -d film_project -f /tmp/prac.init.sql
docker-compose exec database psql -U postgres -d film_project -f /tmp/prac.films.sql
docker-compose exec database psql -U postgres -d film_project -f /tmp/prac.schedules.sql
```

## 9. Закрытие порта pgAdmin через фаервол

```bash
# Установка ufw (если не установлен)
sudo apt install -y ufw

# Разрешаем SSH и HTTP
sudo ufw allow ssh
sudo ufw allow http

# Закрываем порт pgAdmin (8080)
sudo ufw deny 8080

# Включаем фаервол
sudo ufw enable

# Проверяем статус
sudo ufw status
```

## 10. Настройка SSH-туннеля для доступа к pgAdmin

Для подключения к pgAdmin через SSH-туннель выполните на локальной машине:

```bash
ssh -L 8080:localhost:8080 user@your_server_ip
```

После этого вы сможете открыть pgAdmin в браузере по адресу `http://localhost:8080` 