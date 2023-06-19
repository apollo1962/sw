# Техническое задание
Требуемый функционал
Приложение должно обеспечить пользователю поиск по имени персонажей, планет и космических кораблей саги Star Wars.
Первоначальный экран приложения должен содержать строку ввода и кнопку для запуска поиска.
После выполнения поиска, его результаты должны появиться ниже поля ввода и кнопки, которые должны остаться доступными и функциональными для повторного поиска.
В результатах поиска должны появиться все персонажи, планеты и космические корабли, чьё имя/название подходит для ввода пользователя (регистр не важен). Для получения данных нужно использовать это АПИ: https://swapi.dev/api/
Для каждого найденного персонажа нужно вывести как минимум следующие данные: имя, пол, вес.
Для каждой найденной планеты нужно вывести как минимум следующие данные: название, диаметр, кол-во населения.
Для каждого космического корабля нужно вывести как минимум следующие данные: название, длина корабля, размер команды.
Дополнительный функционал
Для получения дополнительных баллов исполнитель может реализовать в приложении вызов АПИ (GET), который должен принимать один строковый параметр (строка поиска) и вернуть в виде массива json все найденные объекты (персонажи, планеты, космические корабли). На поля объектов действуют те же ограничения, что описаны в предыдущем разделе.

# Использование
Подтянуть репозиторий локально, и выполнить npm install.
После установки всех зависимостей, нужно запустить сервер и webpack.

# Dispatch
В проекте все сводиться к одной функции - dispatch.

1. Получаем список всех url;
2. В каждому из API запросов, ищем совпадения по ключевому слову;
3. Т.к в API JSON разделенны пагинацией, мы делаем каждый раз рекурсивно запрос к next, условие для выхода из рекурсии это если next === null.

```
export function dispatch(options) {
  let done = false
  let numberOfRequests = 0
  let completedRequests = 0
  let found = false
  let cnt = 0

  const handleResult = (type, result, properties) => {
    cnt++
    const data = {type}

    properties.forEach(property => {
      if (result[property]) {
        data[property] = result[property]
      }
    })

    options.fn(data)
  }

  const fetchNext = (url) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        let regex = new RegExp(options.query, 'i')
        let result = data.results.find(obj => {
          return (obj.name && regex.test(obj.name)) || (obj.title && regex.test(obj.title))
        })

        if (result) {
          if (url.includes('people')) {
            handleResult('people', result, ['name', 'gender', 'mass'])
          } else if (url.includes('planets')) {
            handleResult('planets', result, ['name', 'diameter', 'population'])
          } else if (url.includes('starships')) {
            handleResult('starships', result, ['name', 'length', 'crew'])
          }

          found = true
        }

        if (data.next !== null) {
          fetchNext(data.next)
        } else {
          completedRequests++
          if (completedRequests === numberOfRequests) {
            if (!found) {
              options.done('Found nothing')
            } else {
              options.done(`Found ${cnt} matches`)
            }
          }
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }

  fetch(options.url)
    .then(response => response.json())
    .then(data => {
      numberOfRequests = Object.keys(data).length

      for (let api in data) {
        const path = data[api]

        if (!done) {
          fetchNext(path)
        }
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error)
    })
}
```
