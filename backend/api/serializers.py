"""
Сериализаторы для API приложения криптоплатформы.

Этот модуль содержит DRF сериализаторы для преобразования данных между
Django моделями и JSON форматом для API.
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from decimal import Decimal
import logging
from .models import FavoriteCrypto

logger = logging.getLogger(__name__)

class UserSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели User.
    
    Используется для возврата данных пользователя в API ответах.
    Включает только безопасные поля (id, username, email).
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class RegisterSerializer(serializers.ModelSerializer):
    """
    Сериализатор для регистрации новых пользователей.
    
    Включает валидацию паролей и создание пользователя с хешированным паролем.
    """
    # Пароли только для записи, не возвращаются в ответах
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)  # Подтверждение пароля

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        """
        Валидация данных регистрации.
        
        Проверяет, что пароли совпадают.
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        """
        Создание нового пользователя с хешированным паролем.
        
        Удаляет password2 из данных перед созданием пользователя.
        """
        # Удаляем password2, так как он не нужен для создания пользователя
        validated_data.pop('password2', None)
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])  # Хеширует пароль
        user.save()
        return user

class FavoriteCryptoSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели FavoriteCrypto.
    
    Обрабатывает создание и обновление избранных криптовалют.
    Включает валидацию числовых полей и автоматическое назначение пользователя.
    """
    # Переопределяем поля для более гибкой валидации
    current_price = serializers.DecimalField(max_digits=20, decimal_places=8, required=False, allow_null=True)
    market_cap = serializers.IntegerField(required=False, allow_null=True)
    price_change_24h = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    price_change_percentage_24h = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    image_url = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    
    class Meta:
        model = FavoriteCrypto
        fields = '__all__'
        # Эти поля заполняются автоматически
        read_only_fields = ('user', 'created_at', 'updated_at')

    def create(self, validated_data):
        """
        Создание новой записи избранной криптовалюты.
        
        Автоматически назначает текущего пользователя и обрабатывает
        числовые поля для предотвращения ошибок валидации.
        """
        logger.info(f"Creating favorite crypto with data: {validated_data}")
        
        if self.context['request'].user.is_authenticated:
            # Автоматически назначаем текущего пользователя
            validated_data['user'] = self.context['request'].user
            logger.info(f"User is authenticated: {validated_data['user'].username}")
            
            # Обработка числовых полей с защитой от ошибок
            if 'current_price' in validated_data and validated_data['current_price'] is not None:
                try:
                    validated_data['current_price'] = Decimal(str(validated_data['current_price']))
                    logger.info(f"Converted current_price to Decimal: {validated_data['current_price']}")
                except Exception as e:
                    logger.error(f"Error converting current_price: {e}")
                    validated_data['current_price'] = None
                    
            if 'market_cap' in validated_data and validated_data['market_cap'] is not None:
                try:
                    validated_data['market_cap'] = int(validated_data['market_cap'])
                    logger.info(f"Converted market_cap to int: {validated_data['market_cap']}")
                except Exception as e:
                    logger.error(f"Error converting market_cap: {e}")
                    validated_data['market_cap'] = None
                    
            if 'price_change_24h' in validated_data and validated_data['price_change_24h'] is not None:
                try:
                    validated_data['price_change_24h'] = Decimal(str(validated_data['price_change_24h']))
                    logger.info(f"Converted price_change_24h to Decimal: {validated_data['price_change_24h']}")
                except Exception as e:
                    logger.error(f"Error converting price_change_24h: {e}")
                    validated_data['price_change_24h'] = None
                    
            if 'price_change_percentage_24h' in validated_data and validated_data['price_change_percentage_24h'] is not None:
                try:
                    validated_data['price_change_percentage_24h'] = Decimal(str(validated_data['price_change_percentage_24h']))
                    logger.info(f"Converted price_change_percentage_24h to Decimal: {validated_data['price_change_percentage_24h']}")
                except Exception as e:
                    logger.error(f"Error converting price_change_percentage_24h: {e}")
                    validated_data['price_change_percentage_24h'] = None
                    
            logger.info(f"Final validated_data: {validated_data}")
            return super().create(validated_data)
        else:
            logger.error("User is not authenticated")
            raise serializers.ValidationError("User must be authenticated to add favorites")
