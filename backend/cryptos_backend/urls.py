"""
Главная URL конфигурация для проекта cryptos_backend.

Этот файл определяет основные маршруты проекта:
- Админ-панель Django
- API endpoints (включает все URL из приложения api)

Все API endpoints доступны по префиксу /api/
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Админ-панель Django (доступна по адресу /admin/)
    path('admin/', admin.site.urls),
    
    # API endpoints (все URL из приложения api доступны по префиксу /api/)
    # Например: /api/auth/register/, /api/cryptos/, /api/favorites/
    path('api/', include('api.urls')),
]
