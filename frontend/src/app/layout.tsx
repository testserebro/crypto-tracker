/**
 * Главный layout компонент приложения.
 * 
 * Определяет общую структуру всех страниц приложения, включая:
 * - Настройки шрифтов (Geist Sans и Geist Mono)
 * - Метаданные страницы
 * - Провайдер аутентификации
 * - Общий заголовок (Header)
 * - Основной контент страниц
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/Header";

// Настройка основного шрифта Geist Sans
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Настройка моноширинного шрифта Geist Mono
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Метаданные приложения для SEO
export const metadata: Metadata = {
  title: "Crypto Tracker - Track Cryptocurrency Prices",
  description: "A modern cryptocurrency tracking application with real-time prices and favorites management",
};

/**
 * Корневой layout компонент.
 * 
 * Оборачивает все страницы приложения и предоставляет:
 * - HTML структуру с правильным языком
 * - Настройки шрифтов через CSS переменные
 * - Провайдер аутентификации для глобального состояния
 * - Общий заголовок на всех страницах
 * 
 * @param children - дочерние компоненты (содержимое страниц)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Провайдер аутентификации - оборачивает все приложение */}
        <AuthProvider>
          {/* Общий заголовок для всех страниц */}
          <Header />
          {/* Основной контент страниц */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
