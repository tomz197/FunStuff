export default class Anchor {
  /**
   * @typedef {Array} Line
   * @property {LineControllerElement} 0
   * @property {Anchor} 1
   */
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {SVGCircleElement} circle 
   * @param {Line} lines 
   */
  constructor(x, y, circle, lines = []) {
    this.x = x;
    this.y = y;
    this.circle = circle;
    this.lines = lines;
  }

  /**
   * @param {Line} line 
   */
  removeLine = ([line, otherAnchor]) => {
    const index = this.lines.findIndex(([l, _]) => l === line);
    // const index = this.lines.findIndex(([_, a]) => otherAnchor.isAt(a.x, a.y));
    if (index === -1) return false;
    this.lines.splice(index, 1);
    return true;
  }

  removeAllLines = () => {
    for (const [line, otherPoint] of this.lines) {
      otherPoint.removeLine(line);
    }
    this.lines = [];
  }

  /**
   * @param {LineControllerElement} line 
   * @param {Anchor} anchor 
   */
  addLine = (line, anchor) => {
    this.lines.push([line, anchor]);
  }

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @returns {boolean}
   */
  isAt = (x, y) => {
    return this.x === x && this.y === y;
  }
}