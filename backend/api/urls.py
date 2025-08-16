"""
URL конфигурация для API приложения криптоплатформы.

Этот модуль определяет маршруты (URL patterns) для всех API endpoints.
Включает аутентификацию, работу с криптовалютами и избранным.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, 
    LoginView, 
    CryptoListView, 
    FavoriteCryptoListCreateView, 
    FavoriteCryptoDetailView,
    crypto_detail
)

urlpatterns = [
    # ===== АУТЕНТИФИКАЦИЯ =====
    # Регистрация нового пользователя
    path('auth/register/', RegisterView.as_view(), name='register'),
    # Вход в систему
    path('auth/login/', LoginView.as_view(), name='login'),
    # Обновление JWT токена
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # ===== КРИПТОВАЛЮТЫ =====
    # Список всех криптовалют (с данными с CoinGecko API)
    path('cryptos/', CryptoListView.as_view(), name='crypto-list'),
    # Детальная информация о конкретной криптовалюте
    path('cryptos/<str:crypto_id>/', crypto_detail, name='crypto-detail'),
    
    # ===== ИЗБРАННОЕ =====
    # Список избранных криптовалют пользователя (GET) и добавление новых (POST)
    path('favorites/', FavoriteCryptoListCreateView.as_view(), name='favorite-list-create'),
    # Детали конкретной избранной криптовалюты (GET) и удаление (DELETE)
    path('favorites/<int:pk>/', FavoriteCryptoDetailView.as_view(), name='favorite-detail'),
]

