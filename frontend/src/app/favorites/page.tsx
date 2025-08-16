/**
 * Страница избранных криптовалют пользователя.
 * 
 * Отображает список криптовалют, добавленных пользователем в избранное.
 * Позволяет удалять криптовалюты из избранного. Доступна только
 * аутентифицированным пользователям.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { FavoriteCrypto } from '@/types';
import { favoritesAPI } from '@/lib/api';
import { Heart, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

export default function FavoritesPage() {
  // Состояние списка избранных криптовалют
  const [favorites, setFavorites] = useState<FavoriteCrypto[]>([]);
  // Состояние загрузки данных
  const [loading, setLoading] = useState(true);
  // Состояние ошибки при загрузке
  const [error, setError] = useState<string | null>(null);
  
  // Получаем данные пользователя из контекста аутентификации
  const { user } = useAuth();
  const router = useRouter();

  /**
   * Эффект для проверки аутентификации и загрузки избранного.
   * Перенаправляет на страницу входа, если пользователь не аутентифицирован.
   */
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchFavorites();
  }, [user, router]);

  /**
   * Функция для получения списка избранных криптовалют с API.
   * Обрабатывает загрузку, ошибки и обновляет состояние компонента.
   */
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await favoritesAPI.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError('Failed to fetch favorites');
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Обработчик удаления криптовалюты из избранного.
   * Удаляет запись с backend и обновляет локальное состояние.
   * 
   * @param favoriteId - ID записи избранной криптовалюты
   */
  const handleRemoveFavorite = async (favoriteId: number) => {
    try {
      await favoritesAPI.removeFromFavorites(favoriteId);
      // Удаляем из локального состояния
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      alert('Error removing from favorites');
    }
  };

  /**
   * Форматирует цену в USD с правильным количеством десятичных знаков.
   * @param price - цена в USD (может быть null)
   * @returns отформатированная строка цены или 'N/A'
   */
  const formatPrice = (price: number | null) => {
    if (price === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  /**
   * Форматирует рыночную капитализацию в удобочитаемом виде.
   * @param marketCap - рыночная капитализация (может быть null)
   * @returns отформатированная строка или 'N/A'
   */
  const formatMarketCap = (marketCap: number | null) => {
    if (marketCap === null) return 'N/A';
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;  // Триллионы
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;   // Миллиарды
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;   // Миллионы
    } else {
      return `$${marketCap.toLocaleString()}`;       // Обычный формат
    }
  };

  /**
   * Форматирует процентное изменение с правильным знаком.
   * @param percentage - процентное изменение (может быть null)
   * @returns отформатированная строка или 'N/A'
   */
  const formatPercentage = (percentage: number | null) => {
    if (percentage === null) return 'N/A';
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  // Если пользователь не аутентифицирован, не отображаем ничего
  if (!user) {
    return null;
  }

  // Отображение состояния загрузки
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Отображение ошибки с возможностью повторить запрос
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchFavorites}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок с количеством избранных */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-red-500" />
          <span className="text-lg font-medium text-gray-700">
            {favorites.length} {favorites.length === 1 ? 'cryptocurrency' : 'cryptocurrencies'}
          </span>
        </div>
      </div>

      {/* Отображение пустого состояния или списка избранного */}
      {favorites.length === 0 ? (
        // Пустое состояние - нет избранных криптовалют
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-4">
            Start adding cryptocurrencies to your favorites to see them here.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Browse Cryptocurrencies
          </button>
        </div>
      ) : (
        // Сетка карточек избранных криптовалют
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              {/* Заголовок карточки с логотипом, названием и кнопкой удаления */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {/* Логотип криптовалюты (если есть) */}
                  {favorite.image_url && (
                    <img 
                      src={favorite.image_url} 
                      alt={favorite.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div>
                    {/* Название и символ криптовалюты */}
                    <h3 className="font-semibold text-gray-900">{favorite.name}</h3>
                    <p className="text-sm text-gray-500 uppercase">{favorite.symbol}</p>
                  </div>
                </div>
                
                {/* Кнопка удаления из избранного */}
                <button
                  onClick={() => handleRemoveFavorite(favorite.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove from favorites"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              {/* Основная информация о криптовалюте */}
              <div className="space-y-3">
                {/* Текущая цена */}
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(favorite.current_price)}
                  </p>
                </div>

                {/* Изменение цены за 24 часа (если есть данные) */}
                {favorite.price_change_percentage_24h !== null && (
                  <div className="flex items-center space-x-2">
                    {/* Иконка тренда */}
                    {favorite.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    {/* Процентное изменение */}
                    <span 
                      className={`text-sm font-medium ${
                        favorite.price_change_percentage_24h >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}
                    >
                      {formatPercentage(favorite.price_change_percentage_24h)}
                    </span>
                  </div>
                )}

                {/* Дополнительная рыночная информация */}
                <div className="text-sm text-gray-600">
                  <p>Market Cap: {formatMarketCap(favorite.market_cap)}</p>
                  {favorite.price_change_24h !== null && (
                    <p>24h Change: {formatPrice(favorite.price_change_24h)}</p>
                  )}
                </div>

                {/* Дата добавления в избранное */}
                <div className="text-xs text-gray-400">
                  Added: {new Date(favorite.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

