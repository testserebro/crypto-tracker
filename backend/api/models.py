"""
Модели для API приложения криптоплатформы.

Этот модуль содержит Django модели для работы с избранными криптовалютами пользователей.
"""

from django.db import models
from django.contrib.auth.models import User

class FavoriteCrypto(models.Model):
    """
    Модель для хранения избранных криптовалют пользователей.
    
    Позволяет пользователям сохранять свои любимые криптовалюты
    с актуальными данными о ценах и рыночной капитализации.
    """
    
    # Связь с пользователем (один пользователь может иметь много избранных)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    
    # Основная информация о криптовалюте
    crypto_id = models.CharField(max_length=100)  # Уникальный ID криптовалюты из CoinGecko API
    name = models.CharField(max_length=200)       # Название криптовалюты (например, "Bitcoin")
    symbol = models.CharField(max_length=20)      # Символ криптовалюты (например, "BTC")
    
    # Рыночные данные (могут быть null, так как цены меняются)
    current_price = models.DecimalField(max_digits=20, decimal_places=8, null=True, blank=True)
    market_cap = models.BigIntegerField(null=True, blank=True)  # Рыночная капитализация
    price_change_24h = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_change_percentage_24h = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Визуальные данные
    image_url = models.URLField(max_length=500, null=True, blank=True)  # URL логотипа криптовалюты
    
    # Временные метки
    created_at = models.DateTimeField(auto_now_add=True)  # Когда добавлено в избранное
    updated_at = models.DateTimeField(auto_now=True)      # Когда последний раз обновлено

    class Meta:
        """
        Мета-класс для настройки модели.
        """
        # Один пользователь может добавить конкретную криптовалюту только один раз
        unique_together = ['user', 'crypto_id']
        # Сортировка по дате добавления (новые сверху)
        ordering = ['-created_at']

    def __str__(self):
        """
        Строковое представление объекта для админ-панели.
        """
        return f"{self.user.username} - {self.name} ({self.symbol})"
