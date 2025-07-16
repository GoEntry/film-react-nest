-- Подключение к базе данных
\c film_project;

-- Заполнение таблицы расписания сеансов
-- Для каждого фильма создаются сеансы в разное время и в разных залах

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

-- Расписание для фильма "Стражи Гримуара" с некоторыми занятыми местами
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