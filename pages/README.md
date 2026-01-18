# Папка `pages`

FSD конфликтует с Next.js, ссылка на документацию по решению конфликта приложена, структура папок выставлена в точности
так, как сказано в документации

## Полезные ссылки

- Документация по интеграции FSD с Next.js:  
  https://feature-sliced.design/docs/guides/tech/with-nextjs

## Пример использования

```js
// app/page.js
// страница Home берётся из FSD-структуры
// @ - указывает на src папку в проекте
export { Home as default, metadata } from '@/pages/home'; 
