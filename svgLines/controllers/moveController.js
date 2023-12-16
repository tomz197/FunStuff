import SvgCanvas from '../classes/svgCanvas.js';
export default class MoveController {
  /**
   * @typedef {Object} Point
   * @property {number} x
   * @property {number} y
   * @property {SVGCircleElement} circle
   * @property {[LineControllerElement, Point][]} lines
   */
  /** @type {{x: number, y: number}} */
  #moveFrom = null;
  /** @type {Point} */
  #movingPoint = null;
  /** @type {SvgCanvas} */
  #canvas;

  /**
   * @param {SvgCanvas} canvas 
   */
  constructor(canvas) {
    this.#canvas = canvas;
  }

  mount() {
    this.#canvas.svg.addEventListener("mousemove", this.#handleMouseMove)
    this.#canvas.svg.addEventListener("mousedown", this.#handleLeftClick);
    this.#canvas.svg.addEventListener("mouseup", this.#handleLeftClick);
    // window.addEventListener("contextmenu", this.#handleRightClick);
  }

  unmount() {
    this.#canvas.svg.removeEventListener("mousemove", this.#handleMouseMove)
    window.removeEventListener("click", this.#handleLeftClick);
    // window.removeEventListener("contextmenu", this.#handleRightClick);
    this.#reset();
  }

  #handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    if (!this.#movingPoint) return;
    this.#canvas.movePoint(this.#movingPoint, clientX, clientY);
  }

  // #handleMouseDown = (event) => {
  //   const { clientX, clientY } = event;
  //   this.#movingPoint = this.#canvas.getPoint(clientX, clientY);
  //   if (!this.#movingPoint) return;
  //   this.#moveFrom = { x: clientX, y: clientY };
  // }

  // #handleMouseUp = (event) => {
  //   if (!this.#movingPoint) return;
  //   this.#canvas.movePoint(this.#movingPoint, this.#moveFrom.x, this.#moveFrom.y);
  //   this.#movingPoint = null;
  //   this.#moveFrom = null;
  // }
  #handleLeftClick = (event) => {
    const { clientX, clientY } = event;

    if (this.#movingPoint) {
      this.#canvas.movePoint(this.#movingPoint, clientX, clientY);
      this.#movingPoint = null;
      return;
    }

    this.#movingPoint = this.#canvas.getPoint(clientX, clientY);
    if (!this.#movingPoint) return;
    this.#moveFrom = { x: clientX, y: clientY };
  }

  #handleRightClick = (event) => {
    console.log("right click");
    event.preventDefault();
    if (!this.#movingPoint) return;
    this.#canvas.movePoint(this.#movingPoint, this.#moveFrom.x, this.#moveFrom.y);
    this.#movingPoint = null;
    this.#moveFrom = null;
  }

  #reset() {
    this.#moveFrom = null;
    this.#movingPoint = null;
  }
}