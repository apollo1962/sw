// 📁 src ∴∵ ⦙ 📁 services ∴∵ ⦙ methods.js

// ✋ ∴∵
Element.prototype.inst = function (est, method, where) {
  let parent = est.parentNode
  let sibling = est.nextElementSibling

  switch (method) {
    case 'in':
      if (where) {
        est.querySelector('.' + where).appendChild(this)
      } else {
        est.insertAdjacentElement('beforeend', this)
      }

      break
    case 'put':
      parent.insertBefore(this, sibling)
      sibling.remove()

      break
    default:
      console.error('Invalid method:', method)
  }

  return this
}

Element.prototype.get = function (...children) {
  let element = this

  for (const child of children) {
    if (typeof child === 'string') {
      const found = element.querySelector('.' + child)

      if (found) {
        element = found
      } else {
        return null
      }
    } else {
      element = element.children[child]

      if (!element) return null
    }
  }

  return element
}