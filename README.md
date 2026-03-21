## Назначение

Портфолио gamedev разработчика

## Инициализация

Для работы должeн быть установлен [node.js](https://nodejs.org/en/) v22.21.1

В папке с исходниками требуется установить зависимости, выполнив:

``` bash
yarn install
```


## Сборка

Сборка в папку out/:

``` bash
yarn run build
```




## Архитектура

FSD - feature sliced design

DOC: https://feature-sliced.design/


## Разработка
Запускается на http://localhost:3000 или на указаном порте

``` bash
yarn run dev
```

Entrypoint - http://localhost:3000


## Переменные окружения

Для dev сборки скопировать файл .env.example в .env