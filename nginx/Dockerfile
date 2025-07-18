# Используем официальный образ nginx для обслуживания статических файлов
FROM nginx:latest

# Копируем нашу конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Создаем директорию для статических файлов
RUN mkdir -p /usr/share/nginx/html

# Открываем порт 80 для HTTP трафика
EXPOSE 80

# Запускаем nginx в режиме без демонизации для правильной работы в контейнере
CMD ["nginx", "-g", "daemon off;"]