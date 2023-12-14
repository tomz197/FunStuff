import SvgCanvas from "../classes/svgCanvas.js";

export default class LineController {
  /**
   * @typedef {Object} Point
   * @property {number} x
   * @property {number} y
   * @property {SVGCircleElement} circle
   * @property {[LineControllerElement, Point][]} lines
   */
  /** @type {Point} */
  #prevPoint = null;
  /** @type {LineControllerElement} */
  #mockLine = null;
  /** @type {SvgCanvas} */
  #canvas;
  #lineColor;
  #mockLineColor;

  /**
   * 
   * @param {SvgCanvas} canvas 
   * @param {string} lineColor 
   * @param {string} mockLineColor 
   */
  constructor(
    canvas,
    lineColor = "red",
    mockLineColor = "black"
  ) {
    this.#canvas = canvas;
    this.#lineColor = lineColor;
    this.#mockLineColor = mockLineColor;
  }

  mount() {
    this.#canvas.svg.addEventListener("click", this.#handleLeftClick);
    window.addEventListener("contextmenu", this.#handleRightClick);
  }

  unmount() {
    this.#canvas.svg.removeEventListener("click", this.#handleLeftClick);
    window.removeEventListener("contextmenu", this.#handleRightClick);
    this.#reset();
  }

  #handleLeftClick = (event) => {
    const { clientX, clientY } = event;
    let point = this.#canvas.getPoint(clientX, clientY);

    if (!point){
      point = this.#canvas.createPoint(clientX, clientY);
    }
    
    if (!this.#prevPoint) {
      this.#prevPoint = point;
      window.addEventListener("mousemove", this.#handleMouseMove);
      return;
    }
    if (this.#prevPoint.x === point.x && this.#prevPoint.y === point.y) {
      this.#handleRightClick();
      return;
    }

    this.#canvas.drawLine(this.#prevPoint, point, this.#lineColor);
    window.removeEventListener("mousemove", this.#handleMouseMove);
    window.addEventListener("mousemove", this.#handleMouseMove);
    this.#prevPoint = point;
  }

  #handleRightClick = (event) => {
    event.preventDefault();
    if (!this.#prevPoint) return;
    this.#handleRemoveMouseMove();
    this.#prevPoint = null;
  }

  #handleRemoveMouseMove = () => {
    if (!this.#mockLine) return;
    window.removeEventListener("mousemove", this.#handleMouseMove);
    this.#canvas.svg.removeChild(this.#mockLine);
    this.#mockLine = null;
  }

  #handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    if (!this.#mockLine) {
      const newLine = this.#canvas.createLine(
        this.#prevPoint.x,
        this.#prevPoint.y,
        clientX,
        clientY,
        this.#mockLineColor
      )
      this.#mockLine = newLine;
    }
    const line = this.#mockLine;
    line.setAttribute("x1", this.#prevPoint.x);
    line.setAttribute("y1", this.#prevPoint.y);
    line.setAttribute("x2", clientX);
    line.setAttribute("y2", clientY);
    this.#mockLine = line;
  }

  #reset = () => {
    this.#handleRemoveMouseMove();
    this.#prevPoint = null;
  }
}