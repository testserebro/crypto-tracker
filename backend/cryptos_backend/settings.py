"""
Настройки Django для проекта cryptos_backend.

Этот файл содержит все настройки Django проекта, включая:
- Базовые настройки Django
- Настройки REST Framework
- Настройки JWT аутентификации
- Настройки CORS для работы с фронтендом
- Настройки базы данных и безопасности

Для продакшена необходимо изменить SECRET_KEY и DEBUG = False.
"""

from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# ===== БАЗОВЫЕ НАСТРОЙКИ DJANGO =====

# SECURITY WARNING: keep the secret key used in production secret!
# В продакшене используйте переменную окружения для SECRET_KEY
SECRET_KEY = 'django-insecure-gy941zgp*@c=h5^g!z0tlx35o#nr__u%-#)&5&pi@vygv0d!37'

# SECURITY WARNING: don't run with debug turned on in production!
# В продакшене установите DEBUG = False
DEBUG = True

# Разрешенные хосты для приложения
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# ===== УСТАНОВЛЕННЫЕ ПРИЛОЖЕНИЯ =====

INSTALLED_APPS = [
    # Django встроенные приложения
    'django.contrib.admin',        # Админ-панель
    'django.contrib.auth',         # Система аутентификации
    'django.contrib.contenttypes', # Система типов контента
    'django.contrib.sessions',     # Система сессий
    'django.contrib.messages',     # Система сообщений
    'django.contrib.staticfiles',  # Статические файлы
    
    # Сторонние приложения
    'rest_framework',              # Django REST Framework для API
    'rest_framework_simplejwt',    # JWT токены для аутентификации
    'corsheaders',                 # CORS для работы с фронтендом
    
    # Локальные приложения
    'api',                         # Наше API приложение
]

# ===== MIDDLEWARE =====

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Должен быть первым для CORS
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'cryptos_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'cryptos_backend.wsgi.application'

# ===== БАЗА ДАННЫХ =====

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',  # SQLite для разработки
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ===== ВАЛИДАЦИЯ ПАРОЛЕЙ =====

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# ===== ИНТЕРНАЦИОНАЛИЗАЦИЯ =====

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ===== СТАТИЧЕСКИЕ ФАЙЛЫ =====

STATIC_URL = 'static/'

# ===== ПЕРВИЧНЫЙ КЛЮЧ =====

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ===== НАСТРОЙКИ REST FRAMEWORK =====

REST_FRAMEWORK = {
    # Классы аутентификации (JWT токены)
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # Классы разрешений по умолчанию (разрешить всем)
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
}

# ===== НАСТРОЙКИ JWT =====

SIMPLE_JWT = {
    # Время жизни токенов
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),   # Access токен на 1 час
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),      # Refresh токен на 1 день
    
    # Настройки ротации токенов
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    # Алгоритм подписи
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,

    # Настройки заголовков
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',

    # Классы токенов
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',

    'JTI_CLAIM': 'jti',
}

# ===== НАСТРОЙКИ CORS =====

# Разрешенные источники для CORS (фронтенд)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",    # Next.js dev server
    "http://127.0.0.1:3000",    # Альтернативный адрес
]

# Разрешить передачу учетных данных (cookies, headers)
CORS_ALLOW_CREDENTIALS = True

# ===== НАСТРОЙКИ КЭШИРОВАНИЯ =====

# Настройки кэширования для решения проблем с CoinGecko API
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
        'TIMEOUT': 300,  # 5 минут по умолчанию
        'OPTIONS': {
            'MAX_ENTRIES': 1000,
        }
    }
}

# Время жизни кэша для данных криптовалют
CRYPTO_CACHE_TIMEOUT = 300  # 5 минут
