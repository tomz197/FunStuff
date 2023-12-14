import SvgCanvas from "../classes/svgCanvas.js";

export default class AddController {
  /**
   * @typedef {Object} Point
   * @property {number} x
   * @property {number} y
   * @property {SVGCircleElement} circle
   * @property {[LineControllerElement, Point][]} lines
   */
  /** @type {SvgCanvas} */
  #canvas;

  /**
   * @param {SvgCanvas} canvas 
   */
  constructor(canvas) {
    this.#canvas = canvas;
  }

  mount() {
    this.#canvas.svg.addEventListener("click", this.#handleLeftClick);
    window.addEventListener("contextmenu", this.#handleRightClick);
  }

  unmount() {
    this.#canvas.svg.removeEventListener("click", this.#handleLeftClick);
    window.removeEventListener("contextmenu", this.#handleRightClick);
  }

  #handleLeftClick = (event) => {
    const { clientX, clientY } = event;
    this.#canvas.createPoint(clientX, clientY);
  }

  #handleRightClick = (event) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    this.#canvas.deletePoint(clientX, clientY);
  }

  reset() {
    // this.#canvas.reset();
  }
}
