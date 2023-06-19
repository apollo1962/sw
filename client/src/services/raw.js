// 📁 src ∴∵ ⦙ 📁 services ∴∵ ⦙ raw.js

// 👇 imports ∴∵
import '~stl/elements/index.sass'
import { _ } from '~src/loaders.js'

export class Title {
  constructor(data) {
    const title =
      _(data.h, data.text)

    return title
  }
}

export class Input {
  constructor(data) {
    const input =
      _('input', {
        class: `input`,
        type: data.type,
        autocomplete: 'off',
        autocorrect: 'off',
        placeholder: data.placeholder
      })

    input.addEventListener('input', function () {
      data.value(input.value)
    })

    return input
  }
}

export class Button {
  constructor(data) {
    const button =
      _('button', {class: `button`, type: 'button'},

        data.text ?
          _('span', data.text) :
          null

      )

    if (data.click) button.addEventListener('click', data.click)

    return button
  }
}