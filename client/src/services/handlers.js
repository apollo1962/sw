// 📁 src ∴∵ ⦙ 📁 services ∴∵ ⦙ handlers.js

// 👇 imports ∴∵
import { _ } from '~src/loaders.js'

// ✋ ∴∵
export function handler(data) {
  let node

  if (typeof data.construct === 'function') {
    node = _('div', {class: data.name}, data.construct())
  } else if (data.construct instanceof Array) {
    node = _('div', {class: data.name}, data.construct)
  } else {
    node = _('div', {class: data.name})
  }

  if (data.fn) {
    if (typeof data.fn === 'function') {
      data.fn(node)
    } else if (data.fn instanceof Array) {
      data.fn.forEach(func => {
        if (typeof func === 'function') {
          func(node)
        }
      })
    }
  }

  switch (data.mount[1]) {
    case 'in':
      node.inst(data.mount[0], 'in', data.mount[2])

      break
    case 'put':
      node.inst(data.mount[0], 'put')

      break
    default:
      console.error('Mount method not found')
  }

  return node
}

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