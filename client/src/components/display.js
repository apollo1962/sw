// 📁 src ∴∵ ⦙ 📁 components ∴∵ ⦙ display.js

// 👇 imports ∴∵
import '~stl/components/display.sass'
import { _, handler, dispatch, Title, Input, Button } from '~src/loaders.js'

export const Display = {

  resultsNODE: null,

  component() {
    handler({
      name: 'component_display',
      mount: [window.app, 'in'],
      construct: [
        _('div', {class: 'wrap'})
      ],
      fn: [
        this.factory.header.bind(this),
        this.factory.body.bind(this),
        this.factory.copyrights.bind(this),
        this.factory.results.bind(this)
      ]
    })
  },

  factory: {

    header(parent) {
      handler({
        name: 'header',
        mount: [parent, 'in', 'wrap'],
        construct: [
          _('div', {class: '-logo'},
            _('img', {class: 'logo', src: 'public/images/sw.svg', alt: ''}, 'logo')
          ),
          _('div', {class: '-about'},
            new Title({ h: 'h1', text: 'SWAPI The Star Wars API Search' }),
            _('p', 'Star Wars is an American epic space opera[1] multimedia franchise created by George Lucas, which began with the eponymous 1977 film[b] and quickly became a worldwide pop culture phenomenon. The franchise has been expanded into various films and other media, including television series, video games, novels, comic books, theme park attractions, and themed areas, comprising an all-encompassing fictional universe.[c] Star Wars is one of the highest-grossing media franchises of all time.')
          )
        ]
      })
    },

    body(parent) {
      handler({
        name: 'body',
        mount: [parent, 'in', 'wrap'],
        construct: () => {
          let value = null

          const form = _('div', {class: '-form'},
            _('div', {class: '--input'},
              new Input({
                type: 'search',
                placeholder: 'Search...',
                value: (response) => {
                  value = response
                }
              })
            ),
            _('div', {class: '--button'},
              new Button({
                text: 'Send',
                click: () => {
                  this.fn.state(this.resultsNODE)
                  this.fn.clear(this.resultsNODE)

                  dispatch({
                    url: 'https://swapi.dev/api/',
                    query: value,
                    fn: (response) => {
                      this.fn.row(this.resultsNODE, response)
                    },
                    done: (response) => {
                      this.fn.header(this.resultsNODE, response)
                    }
                  })
                }
              })
            )
          );

          return form
        }
      })
    },

    copyrights(parent) {
      handler({
        name: 'footer',
        mount: [parent, 'in', 'wrap'],
        construct: [
          _('p', {class: 'small'}, 'All rights to the images belong to their respective owners')
        ]
      })
    },

    results(parent) {
      this.resultsNODE = handler({
        name: 'results',
        mount: [parent, 'in', 'wrap'],
        construct: [
          _('div', {class: 'done'}),
          _('table', {class: 'table'})
        ]
      })
    }
  },

  fn: {

    state(results) {
      results.classList.add('_active')
      this.header(results, `...`)
    },

    clear(parent) {
      const tr =
        _('tr',
          _('th', 'Name'),
          _('th', 'Parameter 1'),
          _('th', 'Parameter 2'),
          _('th', 'Parameter 3'),
        )

      parent.get('table').textContent = ''
      tr.inst(parent, 'in', 'table')
    },

    row(parent, data) {
      const tr = _('tr')

      for (let item in data) {
        if (data.hasOwnProperty(item)) {
          const td = _('td', `${item} — ${data[item]}`)
          tr.append(td)
        }
      }

      tr.inst(parent, 'in', 'table');
    },

    header(parent, data) {
      const title = new Title({h: 'h2', text: data})

      parent.get('done').textContent = ''
      title.inst(parent, 'in', 'done')
    }
  }

}