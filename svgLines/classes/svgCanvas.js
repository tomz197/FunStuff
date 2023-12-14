import Anchor from "./anchor.js";

export default class SvgCanvas {
  /**
   * @type {Map<string, Anchor>}
   */
  #anchors = new Map();
  static #circleRadius = 25;
  svg;

  /**
   * @param {SVGElement} svg 
   */
  constructor(svg) {
    this.svg = svg;
  }

  #getAnchorId = (x, y) => `${x},${y}`;
  #getAnchor(gx, gy) {
    const currAnchor = this.#anchors.get(this.#getAnchorId(gx, gy));
    if (!!currAnchor) {
      return currAnchor;
    }

    for (const point of this.#anchors.values()) {
      const { x, y } = point;
      const distance = Math.sqrt((gx - x) ** 2 + (gy - y) ** 2);
      if (distance < SvgCanvas.#circleRadius) {
        return point;
      }
    }
    return undefined;
  }
  /** @param {Anchor} point  */
  #removeAnchor (point) {
    const anchorId = this.#getAnchorId(point.x, point.y);
    const beenRemoved = this.#anchors.delete(anchorId);
    if (!beenRemoved) throw new Error("Failed to remove anchor");
    this.svg.removeChild(point.circle);
  } 
  #setAnchor(x, y) {
    const newPoint = new Anchor(
      x,
      y,
      this.drawCircle(x, y, 25, "red"),
      [],
    );

    this.#anchors.set(this.#getAnchorId(x, y), newPoint);
    return newPoint;
  }

  /**
   * 
   * @param {number} clientX 
   * @param {number} clientY 
   * @returns {Anchor | undefined}
   */
  createPoint(clientX, clientY) {
    const point = this.#getAnchor(clientX, clientY);
    if (point) { return; }
    return this.#setAnchor(clientX, clientY);
  }

  /**
   * 
   * @param {number} clientX 
   * @param {number} clientY 
   * @returns 
   */
  getPoint(clientX, clientY) {
    return this.#getAnchor(clientX, clientY);
  }

  /**
   * 
   * @param {number} clientX 
   * @param {number} clientY 
   * @returns {boolean}
   */
  deletePoint(clientX, clientY) {
    const point = this.#getAnchor(clientX, clientY);
    if (!point) { return false; }
    for (const [line, otherPoint] of point.lines) {
      otherPoint.removeLine([line, point]);
      this.svg.removeChild(line);
    }
    this.#removeAnchor(point);
    return true;
  }

  /**
   * 
   * @param {Point} point 
   * @param {number} x 
   * @param {number} y 
   */
  movePoint(point, x, y) {
    this.#anchors.delete(this.#getAnchorId(point.x, point.y));
    const circle = point.circle;
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    point.x = x;
    point.y = y;
    this.#anchors.set(this.#getAnchorId(x, y), point);
    for (const [line, otherPoint] of point.lines) {
      const { x: otherX, y: otherY } = otherPoint;
      line.setAttribute("x1", x);
      line.setAttribute("y1", y);
      line.setAttribute("x2", otherX);
      line.setAttribute("y2", otherY);
    }
  }

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} r 
   * @param {string} color 
   * @returns 
   */
  drawCircle(x, y, r, color) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", color);
    this.svg.appendChild(circle);
    return circle;
  }

  /**
   * 
   * @param {Anchor} point1 
   * @param {Anchor} point2 
   * @param {string | undefined} color
   * @returns 
   */
  drawLine(point1, point2, color) {
    const { x: x1, y: y1 } = point1;
    const { x: x2, y: y2 } = point2;
    const line = this.createLine(x1, y1, x2, y2, color);
    point1.addLine(line, point2);
    point2.addLine(line, point1);
    return line;
  }

  /**
   * 
   * @param {number} x1 
   * @param {number} y1 
   * @param {number} x2 
   * @param {number} y2 
   * @param {string} color 
   * @returns 
   */
  createLine(x1, y1, x2, y2, color) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "2");

    this.svg.appendChild(line);
    return line;
  }
}