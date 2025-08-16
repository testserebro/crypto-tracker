# 🚀 Crypto Tracker - Криптоплатформа

Современное веб-приложение для отслеживания криптовалют с возможностью добавления в избранное и управления пользователями.

## 📋 Описание

Crypto Tracker - это полнофункциональная платформа для мониторинга криптовалют, построенная на современном стеке технологий:

- **Backend**: Django REST Framework + JWT аутентификация
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **API**: CoinGecko API для данных криптовалют
- **База данных**: SQLite (для разработки)

## ✨ Основные возможности

### 🔐 Аутентификация
- Регистрация новых пользователей
- Вход в систему с JWT токенами
- Автоматическое обновление токенов
- Защищенные маршруты

### 📊 Криптовалюты
- Список топ-100 криптовалют
- Реальные данные с CoinGecko API
- Поиск по названию и символу
- Сортировка по рыночной капитализации, цене, изменению
- Детальная информация о каждой криптовалюте

### ⭐ Избранное
- Добавление криптовалют в избранное
- Управление списком избранного
- Персональные данные для каждого пользователя

### 🎨 Пользовательский интерфейс
- Современный и отзывчивый дизайн
- Адаптивная верстка для всех устройств
- Темная/светлая тема (автоматическая)
- Интуитивная навигация

## 🛠 Технологический стек

### Backend
- **Django 5.2.5** - веб-фреймворк
- **Django REST Framework** - API
- **djangorestframework-simplejwt** - JWT аутентификация
- **django-cors-headers** - CORS поддержка
- **requests** - HTTP клиент для API

### Frontend
- **Next.js 14** - React фреймворк
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - утилитарный CSS фреймворк
- **Axios** - HTTP клиент
- **Lucide React** - иконки

### API
- **CoinGecko API** - данные криптовалют
- **JWT токены** - аутентификация
- **REST API** - архитектура

## 🚀 Установка и запуск

### Предварительные требования
- Python 3.8+
- Node.js 18+
- npm или yarn

### 1. Клонирование репозитория
```bash
git clone https://github.com/your-username/crypto-tracker.git
cd crypto-tracker
```

### 2. Настройка Backend (Django)

```bash
# Переход в папку backend
cd backend

# Создание виртуального окружения
python -m venv venv

# Активация виртуального окружения
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Применение миграций
python manage.py migrate

# Создание суперпользователя (опционально)
python manage.py createsuperuser

# Запуск сервера разработки
python manage.py runserver
```

Backend будет доступен по адресу: http://127.0.0.1:8000

### 3. Настройка Frontend (Next.js)

```bash
# Переход в папку frontend
cd frontend

# Установка зависимостей
npm install
# или
yarn install

# Запуск сервера разработки
npm run dev
# или
yarn dev
```

Frontend будет доступен по адресу: http://localhost:3000

## 📁 Структура проекта

```
crypto-tracker/
├── backend/                 # Django backend
│   ├── api/                # API приложение
│   │   ├── models.py       # Модели данных
│   │   ├── serializers.py  # Сериализаторы
│   │   ├── views.py        # API views
│   │   ├── urls.py         # URL маршруты
│   │   └── admin.py        # Админ-панель
│   ├── cryptos_backend/    # Основной проект Django
│   │   ├── settings.py     # Настройки
│   │   └── urls.py         # Главные URL
│   ├── requirements.txt    # Python зависимости
│   └── manage.py           # Django CLI
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router (Next.js 14)
│   │   ├── components/    # React компоненты
│   │   ├── lib/          # Утилиты и API
│   │   └── types/        # TypeScript типы
│   ├── package.json      # Node.js зависимости
│   └── next.config.js    # Next.js конфигурация
├── .gitignore            # Git исключения
└── README.md            # Документация
```

## 🔧 API Endpoints

### Аутентификация
- `POST /api/auth/register/` - Регистрация
- `POST /api/auth/login/` - Вход
- `POST /api/auth/refresh/` - Обновление токена

### Криптовалюты
- `GET /api/cryptos/` - Список криптовалют
- `GET /api/cryptos/{id}/` - Детали криптовалюты

### Избранное
- `GET /api/favorites/` - Список избранного
- `POST /api/favorites/` - Добавить в избранное
- `DELETE /api/favorites/{id}/` - Удалить из избранного

## 🎯 Особенности реализации

### Кэширование
- Кэширование данных CoinGecko API (5 минут)
- Обработка ошибок 429 (Rate Limiting)
- Fallback данные при недоступности API

### Безопасность
- JWT аутентификация
- Хеширование паролей
- CORS настройки
- Валидация данных

### Производительность
- Кэширование на стороне сервера
- Оптимизированные запросы к БД
- Ленивая загрузка компонентов

## 🐛 Известные проблемы

1. **CoinGecko API лимиты**: Бесплатный API имеет ограничения на количество запросов
2. **Кэширование**: Данные обновляются каждые 5 минут для экономии лимитов

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для получения дополнительной информации.

## 👨‍💻 Автор

**Ваше имя** - [your-email@example.com](mailto:your-email@example.com)

## 🙏 Благодарности

- [CoinGecko](https://coingecko.com/) за предоставление API
- [Django](https://djangoproject.com/) за отличный веб-фреймворк
- [Next.js](https://nextjs.org/) за современный React фреймворк
- [Tailwind CSS](https://tailwindcss.com/) за утилитарный CSS

---

⭐ Если этот проект вам понравился, поставьте звездочку!

