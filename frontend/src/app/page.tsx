/**
 * Главная страница приложения - список криптовалют.
 * 
 * Отображает список всех криптовалют с возможностью поиска и сортировки.
 * Получает данные с CoinGecko API через Django backend.
 * Позволяет пользователям добавлять криптовалюты в избранное.
 */

'use client';

import { useState, useEffect } from 'react';
import { CryptoCurrency } from '@/types';
import { cryptoAPI } from '@/lib/api';
import CryptoCard from '@/components/CryptoCard';
import { Search, Filter } from 'lucide-react';

export default function Home() {
  // Состояние списка криптовалют
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  // Состояние загрузки данных
  const [loading, setLoading] = useState(true);
  // Состояние ошибки при загрузке
  const [error, setError] = useState<string | null>(null);
  // Состояние поискового запроса
  const [searchTerm, setSearchTerm] = useState('');
  // Состояние сортировки (по умолчанию по рыночной капитализации)
  const [sortBy, setSortBy] = useState<'market_cap' | 'price' | 'change'>('market_cap');

  /**
   * Эффект для загрузки данных при монтировании компонента.
   */
  useEffect(() => {
    fetchCryptos();
  }, []);

  /**
   * Функция для получения списка криптовалют с API.
   * Обрабатывает загрузку, ошибки и обновляет состояние компонента.
   */
  const fetchCryptos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cryptoAPI.getCryptos();
      setCryptos(data);
    } catch (err) {
      setError('Failed to fetch cryptocurrencies');
      console.error('Error fetching cryptos:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Фильтрация и сортировка криптовалют на основе поискового запроса и выбранной сортировки.
   * Фильтрует по названию и символу криптовалюты.
   * Сортирует по рыночной капитализации, цене или изменению за 24 часа.
   */
  const filteredAndSortedCryptos = cryptos
    .filter(crypto => 
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.current_price - a.current_price;  // По убыванию цены
        case 'change':
          return b.price_change_percentage_24h - a.price_change_percentage_24h;  // По изменению
        case 'market_cap':
        default:
          return b.market_cap - a.market_cap;  // По рыночной капитализации
      }
    });

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
          onClick={fetchCryptos}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и элементы управления */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Cryptocurrencies</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Поле поиска */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Выпадающий список сортировки */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="market_cap">Market Cap</option>
              <option value="price">Price</option>
              <option value="change">24h Change</option>
            </select>
          </div>
        </div>
      </div>

      {/* Сетка карточек криптовалют */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedCryptos.map((crypto) => (
          <CryptoCard 
            key={crypto.id} 
            crypto={crypto}
            onFavoriteToggle={fetchCryptos}  // Обновляем список при изменении избранного
          />
        ))}
      </div>

      {/* Сообщение, если ничего не найдено */}
      {filteredAndSortedCryptos.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-500">No cryptocurrencies found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
