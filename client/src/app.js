// 👇 Hello ∴∵
console.log('Hello World!')

// 👇 components ∴∵
import { Display } from '~src/components/display.js'

// 👇 styles ∴∵
import '~stl/normalize.css'
import '~stl/reset.sass'
import '~stl/app.sass'

// 👇 window ∴∵
window.app = document.querySelector('.app')

// 👇 app ∴∵
Display.component()