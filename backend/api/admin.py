"""
Админ-панель для API приложения криптоплатформы.

Этот модуль настраивает Django админ-панель для управления моделями.
Позволяет администраторам просматривать и управлять избранными криптовалютами.
"""

from django.contrib import admin
from .models import FavoriteCrypto

@admin.register(FavoriteCrypto)
class FavoriteCryptoAdmin(admin.ModelAdmin):
    """
    Админ-класс для модели FavoriteCrypto.
    
    Настраивает отображение и функциональность в Django админ-панели.
    """
    
    # Поля, отображаемые в списке записей
    list_display = ('user', 'name', 'symbol', 'current_price', 'created_at')
    
    # Фильтры для быстрой фильтрации записей
    list_filter = ('created_at', 'symbol')
    
    # Поля для поиска по записям
    search_fields = ('name', 'symbol', 'user__username')
    
    # Поля, которые нельзя редактировать (только для чтения)
    readonly_fields = ('created_at', 'updated_at')
