![Node.js CI](https://github.com/step1989/backend-project-lvl3/workflows/Node.js%20CI/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/b8b2da1231e662b205ba/maintainability)](https://codeclimate.com/github/step1989/backend-project-lvl3/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b8b2da1231e662b205ba/test_coverage)](https://codeclimate.com/github/step1989/backend-project-lvl3/test_coverage)

# Загрузчик страниц

### Описание
Консольная утилита для загрузки web-страниц

По умолчанию утилита загружет страницу с ресурсами в текущую папку.
Для указания иного расположения воспользуйтесь параметром

`-o, --output [path]`

  ### Установка из npm
```sudo npm install -g downloader-web-page-rsv```


  ### Локальная установка
  Cклонируйте проект

  `git clone https://github.com/step1989/backend-project-lvl3.git`

  В папке с проектом выполните команды

  * `make build`
  * `make publish`
  * `make link`


  ### Использование
  Для вывода справки:
  `page-loader -h`

 ```
Usage: page-loader [options] <path>

Downloader a web pages

Options:
  -V, --version        output the version number
  -o, --output [path]  output folder
  -h, --help           output usage information
  ```
  ### Примеры использования
  Загрузка страницы с параметрами по умолчанию
  [![asciicast](https://asciinema.org/a/gGgqHfyKTNnpxpzx0tx4wHwsq.svg)](https://asciinema.org/a/gGgqHfyKTNnpxpzx0tx4wHwsq)

  Загрузка страницы с указанием папки назначения
  [![asciicast](https://asciinema.org/a/303189.svg)](https://asciinema.org/a/303189)

  Возможен запуск приложения с отображением отладочной информации. Для этого необходимо воспользоваться переменной окружения DEBUG
  `DEBUG=page-loader:* page-loader exmaple.com`

  [![asciicast](https://asciinema.org/a/BBo1YADcHRNMRzT8kXhpbID0j.svg)](https://asciinema.org/a/BBo1YADcHRNMRzT8kXhpbID0j)
