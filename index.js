class Component {
  constructor(element) {
    this.element = element
  }
}

class Automata {
  constructor(width, height, initial, grid) {
    this.width = width
    this.height = height
    this.grid = grid
    this.model = _.range(height).map(() => _.fill(_.range(width), 0))
    this.model[0] = initial
    this.run()
  }
  run() {
    for (let r = 1; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        let color = this.shouldFill(r, c, [this.model[r-1][c-1], this.model[r-1][c], this.model[r-1][c+1]])
        if (color) {
          this.model[r][c] = 1
          this.grid.colorCell(r, c, color)
        }
      }
    }
  }
  shouldFill(row, col, aboveTuple) {
    if (this.is(aboveTuple, [1,1,0])) return '#000'
    if (this.is(aboveTuple, [1,0,1])) return '#666'
    if (this.is(aboveTuple, [0,1,1])) return '#999'
    if (this.is(aboveTuple, [0,1,0])) return '#ccc'
    if (this.is(aboveTuple, [0,0,1])) return '#aaa'
  }
  is (aboveTuple, abc) {
    return aboveTuple[0] === abc[0] && aboveTuple[1] === abc[1] && aboveTuple[2] === abc[2]
  }
}

class Grid extends Component {
  constructor (element, width, height) {
    super(element)
    this.render(height, width)
  }
  render(height, width) {
    this.element.innerHTML = Grid.makeDiv(height, 'row', () => Grid.makeDiv(width, 'cell'))
    this.cells = Array.from(this.element.querySelectorAll('.row')).map((el, n) =>
      Array.from(el.querySelectorAll('.cell'))
    )
  }
  colorCell(row, column, color) {
    this.cells[row][column].style.backgroundColor = color
  }
  setCell(row, column, isFilled) {
    this.cells[row][column].classList.toggle('is-filled', isFilled)
  }
  static makeDiv (n, className, fn) {
    return _.range(n)
      .map(() => `<div class="${className || ''}">${fn ? fn() : ''}</div>`)
      .join('')
  }
}

class App extends Component {
  render() {
    this.element.innerHTML = `
      <grid></grid>
    `

    const h = 3000
    const w = 1000
    const initial = _.fill(_.range(w), 0)
    initial[w-1] = 1

    const g = new Grid(this.element.querySelector('grid'), w, h)
    g.setCell(0, w-1, true)
    const a = new Automata(w, h, initial, g)
  }
}

const app = new App(document.querySelector('#App'))
app.render()