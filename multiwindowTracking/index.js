/**
 * @fileoverview
 * This script is injected into every page to track the position of the window.
 * It creates a div with an image of a cat that follows the window around.
 */

/**
 * @typedef {Object} Position
 * @property {number} left
 * @property {number} top
 * @property {number} right
 * @property {number} bottom
 */

/** creates a div with an image of a cat
 * @returns {HTMLDivElement}
 */
function createDiv() {
  div = document.createElement('div');
  image = document.createElement('img');

  div.style.position = 'fixed';
  div.style.top = '0';
  div.style.right = '0';
  div.style.bottom = '0';
  div.style.left = '0';
  div.style.zIndex = '99';

  image.src = './images/kitty.jpg';
  image.style.width = '100%';
  image.style.height = '100%';

  div.appendChild(image);
  document.body.appendChild(div);

  return div;
}


/**
 * @returns {Position}
 */
function getPositions() {
  const left = window.screenX || window.screenLeft;
  const top = window.screenY || window.screenTop;
  const right = left + window.outerWidth;
  const bottom = top + window.outerHeight;

  return {
    left: left || 0, 
    top: top || 0, 
    right: right || 0,
    bottom: bottom || 0,
  };
}


/**
 * @param {String} id 
 */
function updateStorage(id) {
  const { left, top, right, bottom } = getPositions();

  const data = JSON.parse(localStorage.getItem('multiwindowTracking')) || {};
  data[id] = { left, top, right, bottom };

  const stringifiedData = JSON.stringify(data);
  localStorage.setItem('multiwindowTracking', stringifiedData);
}


/**
 * @returns {Position}
 */
function getMaxPositions() {
  data = JSON.parse(localStorage.getItem('multiwindowTracking'));
  const maxPosition = { left: null, top: null, right: 0, bottom: 0 };

  for (const id in data) {
    const { left, top, right, bottom } = data[id];
    if (maxPosition.left == null || maxPosition.top == null) {
      maxPosition.left = left;
      maxPosition.top = top;
    }
    maxPosition.left = Math.min(maxPosition.left, left);
    maxPosition.top = Math.min(maxPosition.top, top);
    maxPosition.right = Math.max(maxPosition.right, right);
    maxPosition.bottom = Math.max(maxPosition.bottom, bottom);
  }

  return maxPosition;
}


function alertDiv(div) {
  const maxPositions = getMaxPositions();
  const currPositions = getPositions();

  const right = currPositions.right - maxPositions.right;
  const bottom = currPositions.bottom - maxPositions.bottom;
  const left = maxPositions.left - currPositions.left;
  const top = maxPositions.top - currPositions.top;

  div.style.right = `${right}px`;
  div.style.bottom = `${bottom}px`;
  div.style.left = `${left}px`;
  div.style.top = `${top}px`;
}


function main() {
  div = createDiv();

  localStorage.setItem('multiwindowTracking', '{}');

  const windowId = (Date.now() + parseInt(Math.random()*1000)).toString(36);

  setInterval(() => {
    updateStorage(windowId);
    alertDiv(div);
  }, 10);
}

(main)();