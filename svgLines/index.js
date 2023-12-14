import SvgCanvas from "./classes/svgCanvas.js";
import AddController from "./controllers/addController.js";
import MoveController from "./controllers/moveController.js";
import LineController from "./controllers/lineController.js";

function switchController(curr, next) {
  curr.unmount();
  next.mount();
  return next;
}

function switchBtn(curr, next) {
  curr.classList.remove("active");
  next.classList.add("active");
  return next;
}

function main() {
  const addBtn = document.getElementById("add");
  const moveBtn = document.getElementById("move");
  const lineBtn = document.getElementById("line");
  
  const svg = document.getElementById("canvas");
  const canvas = new SvgCanvas(svg);

  const addController = new AddController(canvas);
  const moveController = new MoveController(canvas);
  const lineController = new LineController(canvas);

  let currController = addController;
  let currBtn = addBtn;
  addController.mount();

  addBtn.addEventListener("click", (e) => {
    currController = switchController(currController, addController);
    currBtn = switchBtn(currBtn, addBtn);
  });
  moveBtn.addEventListener("click", () => {
    currController = switchController(currController, moveController);
    currBtn = switchBtn(currBtn, moveBtn);
  });
  lineBtn.addEventListener("click", () => {
    currController = switchController(currController, lineController);
    currBtn = switchBtn(currBtn, lineBtn);
  });
}

(main)();