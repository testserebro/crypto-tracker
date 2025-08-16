"""
Views для API приложения криптоплатформы.

Этот модуль содержит Django REST Framework views для обработки HTTP запросов.
Включает аутентификацию, работу с криптовалютами и избранным.
"""

from rest_framework import status, generics, permissions, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import requests
import time
from django.core.cache import cache
from .models import FavoriteCrypto
from .serializers import UserSerializer, RegisterSerializer, FavoriteCryptoSerializer
import logging

logger = logging.getLogger(__name__)

# Кэш для данных криптовалют (5 минут)
CRYPTO_CACHE_KEY = 'crypto_data'
CRYPTO_CACHE_TIMEOUT = 300  # 5 минут

class RegisterView(APIView):
    """
    View для регистрации новых пользователей.
    
    Принимает данные пользователя и создает новую учетную запись.
    Возвращает JWT токены для автоматической аутентификации.
    """
    permission_classes = (permissions.AllowAny,)  # Доступно всем

    def post(self, request):
        """
        Обработка POST запроса для регистрации.
        
        Валидирует данные, создает пользователя и возвращает токены.
        """
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Создает пользователя с хешированным паролем
            refresh = RefreshToken.for_user(user)  # Генерирует JWT токены
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """
    View для аутентификации пользователей.
    
    Проверяет учетные данные и возвращает JWT токены при успешной аутентификации.
    """
    permission_classes = (permissions.AllowAny,)  # Доступно всем

    def post(self, request):
        """
        Обработка POST запроса для входа в систему.
        
        Аутентифицирует пользователя и возвращает JWT токены.
        """
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)  # Проверяет учетные данные
        
        if user:
            refresh = RefreshToken.for_user(user)  # Генерирует JWT токены
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class CryptoListView(APIView):
    """
    View для получения списка криптовалют.
    
    Получает данные с CoinGecko API и добавляет информацию о том,
    какие криптовалюты добавлены в избранное текущего пользователя.
    """
    permission_classes = (permissions.AllowAny,)  # Доступно всем

    def get(self, request):
        """
        Обработка GET запроса для получения списка криптовалют.
        
        Получает данные с CoinGecko API и обогащает их информацией об избранном.
        """
        try:
            # Сначала проверяем кэш
            cached_data = cache.get(CRYPTO_CACHE_KEY)
            if cached_data:
                logger.info("Returning cached crypto data")
                cryptos = cached_data
            else:
                # Получаем данные с CoinGecko API
                url = "https://api.coingecko.com/api/v3/coins/markets"
                params = {
                    'vs_currency': 'usd',      # Цены в долларах
                    'order': 'market_cap_desc', # Сортировка по рыночной капитализации
                    'per_page': 100,           # 100 криптовалют на страницу
                    'page': 1,                 # Первая страница
                    'sparkline': False         # Без графиков
                }
                
                # Добавляем заголовки для избежания блокировки
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
                
                response = requests.get(url, params=params, headers=headers, timeout=10)
                
                # Обрабатываем ошибку 429 (Too Many Requests)
                if response.status_code == 429:
                    logger.warning("CoinGecko API rate limit exceeded, returning cached data or fallback")
                    # Возвращаем кэшированные данные или fallback
                    cached_data = cache.get(CRYPTO_CACHE_KEY)
                    if cached_data:
                        cryptos = cached_data
                    else:
                        # Возвращаем базовые данные для демонстрации
                        cryptos = self._get_fallback_data()
                else:
                    response.raise_for_status()  # Проверяет статус ответа
                    cryptos = response.json()
                    # Кэшируем данные
                    cache.set(CRYPTO_CACHE_KEY, cryptos, CRYPTO_CACHE_TIMEOUT)
                    logger.info("Fetched fresh crypto data and cached it")
            
            # Добавляем информацию о том, добавлена ли криптовалюта в избранное
            if request.user.is_authenticated:
                try:
                    # Получаем список ID избранных криптовалют пользователя
                    user_favorites = list(FavoriteCrypto.objects.filter(user=request.user).values_list('crypto_id', flat=True))
                    for crypto in cryptos:
                        crypto['is_favorite'] = crypto['id'] in user_favorites
                except Exception as e:
                    logger.error(f"Error checking favorites: {e}")
                    # Если не удалось проверить избранное, устанавливаем все как не избранные
                    for crypto in cryptos:
                        crypto['is_favorite'] = False
            else:
                # Для неаутентифицированных пользователей все криптовалюты не избранные
                for crypto in cryptos:
                    crypto['is_favorite'] = False
            
            return Response(cryptos)
            
        except requests.RequestException as e:
            logger.error(f"Error fetching from CoinGecko: {e}")
            # Пытаемся вернуть кэшированные данные при ошибке
            cached_data = cache.get(CRYPTO_CACHE_KEY)
            if cached_data:
                logger.info("Returning cached data due to API error")
                return Response(cached_data)
            return Response({'error': 'Failed to fetch crypto data'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error in CryptoListView: {e}")
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _get_fallback_data(self):
        """
        Возвращает базовые данные криптовалют для демонстрации
        когда API недоступен.
        """
        return [
            {
                'id': 'bitcoin',
                'symbol': 'btc',
                'name': 'Bitcoin',
                'image': 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
                'current_price': 45000.0,
                'market_cap': 850000000000,
                'market_cap_rank': 1,
                'price_change_24h': 500.0,
                'price_change_percentage_24h': 1.12,
                'total_volume': 25000000000,
                'high_24h': 46000.0,
                'low_24h': 44000.0,
                'is_favorite': False
            },
            {
                'id': 'ethereum',
                'symbol': 'eth',
                'name': 'Ethereum',
                'image': 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
                'current_price': 3000.0,
                'market_cap': 350000000000,
                'market_cap_rank': 2,
                'price_change_24h': 50.0,
                'price_change_percentage_24h': 1.67,
                'total_volume': 15000000000,
                'high_24h': 3100.0,
                'low_24h': 2900.0,
                'is_favorite': False
            }
        ]

class FavoriteCryptoListCreateView(generics.ListCreateAPIView):
    """
    View для работы с избранными криптовалютами.
    
    GET: возвращает список избранных криптовалют пользователя
    POST: добавляет новую криптовалюту в избранное
    """
    serializer_class = FavoriteCryptoSerializer
    permission_classes = (permissions.IsAuthenticated,)  # Только для аутентифицированных
    
    def get_queryset(self):
        """
        Возвращает только избранные криптовалюты текущего пользователя.
        """
        return FavoriteCrypto.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """
        Логирование данных запроса для отладки.
        """
        logger.info(f"Received request data: {request.data}")
        logger.info(f"User: {request.user.username}")
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        """
        Выполняет создание записи с дополнительной валидацией.
        
        Проверяет, не добавлена ли уже эта криптовалюта в избранное.
        """
        crypto_id = serializer.validated_data['crypto_id']
        logger.info(f"Checking if crypto {crypto_id} is already in favorites for user {self.request.user.username}")
        
        # Проверяем, не добавлена ли уже эта криптовалюта в избранное
        if FavoriteCrypto.objects.filter(user=self.request.user, crypto_id=crypto_id).exists():
            logger.warning(f"Crypto {crypto_id} is already in favorites for user {self.request.user.username}")
            raise serializers.ValidationError("This cryptocurrency is already in your favorites")
        
        logger.info(f"Saving favorite crypto {crypto_id} for user {self.request.user.username}")
        serializer.save(user=self.request.user)

class FavoriteCryptoDetailView(generics.RetrieveDestroyAPIView):
    """
    View для работы с отдельной избранной криптовалютой.
    
    GET: возвращает детали избранной криптовалюты
    DELETE: удаляет криптовалюту из избранного
    """
    serializer_class = FavoriteCryptoSerializer
    permission_classes = (permissions.IsAuthenticated,)  # Только для аутентифицированных
    
    def get_queryset(self):
        """
        Возвращает только избранные криптовалюты текущего пользователя.
        """
        return FavoriteCrypto.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def crypto_detail(request, crypto_id):
    """
    Функция-представление для получения детальной информации о криптовалюте.
    
    Получает данные с CoinGecko API для конкретной криптовалюты
    и добавляет информацию о том, добавлена ли она в избранное.
    """
    try:
        # Получаем детальную информацию о криптовалюте с CoinGecko
        url = f"https://api.coingecko.com/api/v3/coins/{crypto_id}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 429:
            return Response({'error': 'API rate limit exceeded. Please try again later.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        
        response.raise_for_status()
        
        crypto_data = response.json()
        
        # Добавляем информацию о том, добавлена ли криптовалюта в избранное
        if request.user.is_authenticated:
            crypto_data['is_favorite'] = FavoriteCrypto.objects.filter(
                user=request.user, 
                crypto_id=crypto_id
            ).exists()
        else:
            crypto_data['is_favorite'] = False
        
        return Response(crypto_data)
        
    except requests.RequestException as e:
        return Response({'error': 'Failed to fetch crypto data'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
