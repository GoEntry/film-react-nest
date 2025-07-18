# Используем Node.js 18 на Alpine Linux для минимального размера образа
FROM node:18-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем только файлы package.json и package-lock.json для кэширования зависимостей
COPY package*.json ./

# Устанавливаем зависимости с использованием чистой установки
# Добавляем установку дополнительных зависимостей для Alpine Linux
RUN apk add --no-cache python3 make g++ \
    && npm ci \
    && npm rebuild rollup --update-binary

# Копируем все файлы проекта в контейнер
COPY . .

# Запускаем сборку проекта, пропуская проверку типов
# Результат будет в директории /app/dist
RUN NODE_ENV=production npx vite build

# Команда для запуска приложения
CMD ["npm", "run", "preview"]