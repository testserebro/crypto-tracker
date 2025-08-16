/**
 * Компонент карточки криптовалюты.
 * 
 * Отображает информацию о криптовалюте в виде карточки с возможностью
 * добавления/удаления из избранного. Включает цену, изменение цены,
 * рыночную капитализацию и объем торгов.
 */

'use client';

import { useState } from 'react';
import { CryptoCurrency } from '@/types';
import { Heart, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { favoritesAPI } from '@/lib/api';

/**
 * Пропсы для компонента CryptoCard.
 */
interface CryptoCardProps {
  crypto: CryptoCurrency;           // Данные криптовалюты
  onFavoriteToggle?: () => void;    // Callback при изменении избранного
}

export default function CryptoCard({ crypto, onFavoriteToggle }: CryptoCardProps) {
  // Получаем данные пользователя из контекста аутентификации
  const { user } = useAuth();
  
  // Состояние избранного (локальное состояние компонента)
  const [isFavorite, setIsFavorite] = useState(crypto.is_favorite || false);
  // Состояние загрузки при работе с избранным
  const [loading, setLoading] = useState(false);

  /**
   * Обработчик переключения избранного.
   * Добавляет или удаляет криптовалюту из избранного пользователя.
   */
  const handleFavoriteToggle = async () => {
    // Проверяем, аутентифицирован ли пользователь
    if (!user) {
      alert('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        // Удаляем из избранного
        // TODO: Реализовать получение ID избранного элемента для удаления
        // Пока просто переключаем состояние
        setIsFavorite(false);
      } else {
        // Добавляем в избранное
        const favoriteData = {
          crypto_id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
        };
        
        console.log('Sending favorite data:', favoriteData);
        console.log('User:', user);
        
        await favoritesAPI.addToFavorites(favoriteData);
        setIsFavorite(true);
      }
      
      // Вызываем callback, если он передан
      if (onFavoriteToggle) {
        onFavoriteToggle();
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      console.error('Error response:', error.response?.data);
      
      // Обработка различных типов ошибок
      if (error.response?.status === 401) {
        alert('Please login to add favorites');
      } else if (error.response?.data?.crypto_id) {
        alert(error.response.data.crypto_id[0]);
      } else {
        alert('Error updating favorites');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Форматирует цену в USD с правильным количеством десятичных знаков.
   * @param price - цена в USD
   * @returns отформатированная строка цены
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,  // До 8 знаков для криптовалют
    }).format(price);
  };

  /**
   * Форматирует рыночную капитализацию в удобочитаемом виде.
   * @param marketCap - рыночная капитализация
   * @returns отформатированная строка (например, "$1.23T", "$456.78B")
   */
  const formatMarketCap = (marketCap: number) => {
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
   * @param percentage - процентное изменение
   * @returns отформатированная строка (например, "+5.23%", "-2.15%")
   */
  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Заголовок карточки с логотипом, названием и кнопкой избранного */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Логотип криптовалюты */}
          <img 
            src={crypto.image} 
            alt={crypto.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            {/* Название криптовалюты */}
            <h3 className="font-semibold text-gray-900">{crypto.name}</h3>
            {/* Символ криптовалюты */}
            <p className="text-sm text-gray-500 uppercase">{crypto.symbol}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Ранг по рыночной капитализации */}
          <span className="text-xs text-gray-500">#{crypto.market_cap_rank}</span>
          {/* Кнопка избранного (только для аутентифицированных пользователей) */}
          {user && (
            <button
              onClick={handleFavoriteToggle}
              disabled={loading}
              className={`p-2 rounded-full transition-colors ${
                isFavorite 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Основная информация о криптовалюте */}
      <div className="space-y-3">
        {/* Текущая цена */}
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(crypto.current_price)}
          </p>
        </div>

        {/* Изменение цены за 24 часа */}
        <div className="flex items-center space-x-2">
          {/* Иконка тренда (вверх/вниз) */}
          {crypto.price_change_percentage_24h >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          {/* Процентное изменение */}
          <span 
            className={`text-sm font-medium ${
              crypto.price_change_percentage_24h >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}
          >
            {formatPercentage(crypto.price_change_percentage_24h)}
          </span>
        </div>

        {/* Дополнительная рыночная информация */}
        <div className="text-sm text-gray-600">
          <p>Market Cap: {formatMarketCap(crypto.market_cap)}</p>
          <p>Volume: {formatMarketCap(crypto.total_volume)}</p>
        </div>
      </div>
    </div>
  );
}
