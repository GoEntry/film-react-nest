# Используем Node.js 18 на Alpine Linux для минимального размера образа
FROM node:18-alpine as build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем только файлы package.json и package-lock.json для кэширования зависимостей
COPY package*.json ./

# Устанавливаем зависимости с использованием чистой установки
# npm ci быстрее и надежнее чем npm install для CI/CD окружений
RUN npm ci

# Копируем все файлы проекта в контейнер
COPY . .

# Запускаем сборку проекта
# Результат будет в директории /app/dist
RUN npm run build 