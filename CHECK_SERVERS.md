# 🔍 Проверка работы серверов

## ✅ Backend (Django) - http://127.0.0.1:8000

### Проверка 1: API эндпоинт
Откройте в браузере: http://127.0.0.1:8000/api/cryptos/

**Ожидаемый результат:**
- JSON с данными криптовалют (массив объектов)
- Каждый объект содержит: id, name, symbol, current_price, и т.д.

**Если ошибка ERR_CONNECTION_REFUSED:**
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

### Проверка 2: Django админка
Откройте в браузере: http://127.0.0.1:8000/admin/

**Ожидаемый результат:**
- Страница входа в админку Django
- **Логин**: admin
- **Пароль**: admin123
- **Альтернативный логин**: superuser
- **Пароль**: admin123

## ✅ Frontend (Next.js) - http://localhost:3000

### Проверка 1: Главная страница
Откройте в браузере: http://localhost:3000

**Ожидаемый результат:**
- Заголовок "Cryptocurrencies"
- Поиск и сортировка
- Карточки криптовалют (если backend работает)
- Кнопки Login/Register в хедере

**Если ошибка:**
```bash
cd frontend
npm run dev
```

## 🔧 Если серверы не запущены

### Запуск Backend:
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

### Запуск Frontend:
```bash
cd frontend
npm run dev
```

## 🚨 Частые проблемы

### 1. Backend не запускается
- **Ошибка**: ModuleNotFoundError: No module named 'rest_framework_simplejwt'
- **Решение**: 
  ```bash
  cd backend
  venv\Scripts\activate
  pip install -r requirements.txt
  ```

### 2. Frontend не запускается
- **Ошибка**: npm error code ENOENT
- **Решение**:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

### 3. CORS ошибки
- **Проблема**: Frontend не может подключиться к backend
- **Решение**: Убедитесь, что оба сервера запущены и работают

## 📊 Статус серверов

- [ ] Backend (http://localhost:8000) - работает
- [ ] Frontend (http://localhost:3000) - работает
- [ ] API доступен (http://localhost:8000/api/cryptos/) - возвращает данные
- [ ] Frontend загружается - отображается интерфейс
