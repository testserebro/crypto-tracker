/**
 * Компонент заголовка (Header) приложения.
 * 
 * Отображает навигационное меню с логотипом, ссылками на страницы
 * и элементами управления аутентификацией (вход/выход).
 * Адаптивно изменяется в зависимости от статуса аутентификации пользователя.
 */

'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { LogOut, User } from 'lucide-react';

export default function Header() {
  // Получаем данные пользователя и функцию выхода из контекста аутентификации
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип и название приложения */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Crypto Tracker
            </Link>
          </div>

          {/* Основная навигация */}
          <nav className="flex items-center space-x-8">
            {/* Ссылка на главную страницу (список криптовалют) */}
            <Link 
              href="/" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Cryptocurrencies
            </Link>
            
            {/* Ссылка на избранное (только для аутентифицированных пользователей) */}
            {user && (
              <Link 
                href="/favorites" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                My Favorites
              </Link>
            )}
          </nav>

          {/* Правая часть заголовка - управление аутентификацией */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Интерфейс для аутентифицированного пользователя
              <div className="flex items-center space-x-4">
                {/* Отображение имени пользователя */}
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{user.username}</span>
                </div>
                {/* Кнопка выхода */}
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              // Интерфейс для неаутентифицированного пользователя
              <div className="flex items-center space-x-4">
                {/* Ссылка на страницу входа */}
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                {/* Ссылка на страницу регистрации */}
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

