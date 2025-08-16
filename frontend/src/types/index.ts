/**
 * TypeScript типы для криптоплатформы.
 * 
 * Этот файл содержит все интерфейсы и типы, используемые в приложении.
 * Определяет структуру данных для пользователей, криптовалют и API запросов.
 */

/**
 * Интерфейс пользователя.
 * Соответствует модели User в Django backend.
 */
export interface User {
  id: number;           // Уникальный идентификатор пользователя
  username: string;     // Имя пользователя для входа
  email: string;        // Email адрес
  first_name?: string;  // Имя (опционально)
  last_name?: string;   // Фамилия (опционально)
}

/**
 * Интерфейс криптовалюты.
 * Соответствует данным, получаемым с CoinGecko API.
 */
export interface CryptoCurrency {
  // Основная информация
  id: string;           // Уникальный ID криптовалюты (например, "bitcoin")
  symbol: string;       // Символ криптовалюты (например, "btc")
  name: string;         // Название криптовалюты (например, "Bitcoin")
  image: string;        // URL изображения/логотипа
  
  // Текущие рыночные данные
  current_price: number;                    // Текущая цена в USD
  market_cap: number;                       // Рыночная капитализация
  market_cap_rank: number;                  // Ранг по рыночной капитализации
  
  // Дополнительные рыночные данные
  fully_diluted_valuation: number | null;   // Полная разводненная оценка
  total_volume: number;                     // Общий объем торгов за 24ч
  high_24h: number;                         // Максимальная цена за 24ч
  low_24h: number;                          // Минимальная цена за 24ч
  
  // Изменения цен
  price_change_24h: number;                 // Изменение цены за 24ч в USD
  price_change_percentage_24h: number;      // Изменение цены за 24ч в %
  market_cap_change_24h: number;            // Изменение рыночной капитализации за 24ч
  market_cap_change_percentage_24h: number; // Изменение рыночной капитализации за 24ч в %
  
  // Информация о предложении
  circulating_supply: number;               // Обращающееся предложение
  total_supply: number | null;              // Общее предложение
  max_supply: number | null;                // Максимальное предложение
  
  // Исторические данные
  ath: number;                              // All Time High (максимальная цена за все время)
  ath_change_percentage: number;            // Изменение от ATH в %
  ath_date: string;                         // Дата достижения ATH
  atl: number;                              // All Time Low (минимальная цена за все время)
  atl_change_percentage: number;            // Изменение от ATL в %
  atl_date: string;                         // Дата достижения ATL
  
  // Дополнительные данные
  roi: any | null;                          // Return on Investment (может быть null)
  last_updated: string;                     // Время последнего обновления данных
  
  // Фронтенд-специфичное поле
  is_favorite?: boolean;                    // Добавлена ли в избранное (добавляется фронтендом)
}

/**
 * Интерфейс избранной криптовалюты.
 * Соответствует модели FavoriteCrypto в Django backend.
 */
export interface FavoriteCrypto {
  id: number;                               // Уникальный идентификатор записи
  user: number;                             // ID пользователя
  crypto_id: string;                        // ID криптовалюты из CoinGecko
  name: string;                             // Название криптовалюты
  symbol: string;                           // Символ криптовалюты
  
  // Рыночные данные (могут быть null, так как цены меняются)
  current_price: number | null;             // Текущая цена
  market_cap: number | null;                // Рыночная капитализация
  price_change_24h: number | null;          // Изменение цены за 24ч
  price_change_percentage_24h: number | null; // Изменение цены за 24ч в %
  image_url: string | null;                 // URL изображения
  
  // Временные метки
  created_at: string;                       // Дата добавления в избранное
  updated_at: string;                       // Дата последнего обновления
}

/**
 * Интерфейс ответа аутентификации.
 * Возвращается при успешном входе или регистрации.
 */
export interface AuthResponse {
  user: User;        // Данные пользователя
  access: string;    // JWT access токен
  refresh: string;   // JWT refresh токен
}

/**
 * Интерфейс запроса на вход в систему.
 */
export interface LoginRequest {
  username: string;  // Имя пользователя
  password: string;  // Пароль
}

/**
 * Интерфейс запроса на регистрацию.
 * Соответствует RegisterSerializer в Django backend.
 */
export interface RegisterRequest {
  username: string;   // Имя пользователя
  email: string;      // Email адрес
  password: string;   // Пароль
  password2: string;  // Подтверждение пароля
  first_name: string; // Имя
  last_name: string;  // Фамилия
}

/**
 * Интерфейс запроса на добавление в избранное.
 * Данные, отправляемые на backend при добавлении криптовалюты в избранное.
 */
export interface AddToFavoritesRequest {
  crypto_id: string;                        // ID криптовалюты
  name: string;                             // Название криптовалюты
  symbol: string;                           // Символ криптовалюты
  
  // Опциональные рыночные данные
  current_price?: number | null;            // Текущая цена
  market_cap?: number | null;               // Рыночная капитализация
  price_change_24h?: number | null;         // Изменение цены за 24ч
  price_change_percentage_24h?: number | null; // Изменение цены за 24ч в %
  image_url?: string | null;                // URL изображения
}

