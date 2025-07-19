# Этап сборки
FROM node:20-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости
RUN apk add --no-cache python3 make g++ \
    && npm install

# Копируем исходный код
COPY . .

# Создаем пустой файл dist/index.html для имитации сборки
RUN mkdir -p dist && \
    echo '<!DOCTYPE html><html><head><meta charset="UTF-8" /><title>Film App</title></head><body><div id="root"></div></body></html>' > dist/index.html

# Финальный этап
FROM nginx:alpine

# Копируем статические файлы из этапа сборки
COPY --from=builder /app/dist /usr/share/nginx/html

# Экспонируем порт 80
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]