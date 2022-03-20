const wrapperForGame = document.querySelector(".wrapper-game");
const countCells = document.getElementById("count-cells");
const startBtn = document.getElementById("start-btn");
const winnerName = document.querySelector(".winner-name");
let countClick = 0;
let step = false;
let circle = `<svg class="circle">
<circle
  r="45"
  cx="58"
  cy="58"
  stroke="#2F4F4F"
  stroke-width="10"
  ,
  fill="none"
  ,
  stroke-linecap="round"
/>
</svg>`;
let cross = `<svg class="cross">
<line
  class="first"
  x1="15"
  ,
  y1="15"
  x2="100"
  y2="100"
  stroke="#008080"
  stroke-width="10"
  stroke-linecap="round"
/>
<line
  class="second"
  x1="100"
  ,
  y1="15"
  x2="15"
  y2="100"
  stroke="#008080"
  stroke-width="10"
  stroke-linecap="round"
/>
</svg>`;
//рисуем крестик
function stepCross(target) {
  target.innerHTML = cross;
  target.classList.add("x");
}
//рисуем нолик
function stepZero(target) {
  target.innerHTML = circle;
  target.classList.add("o");
}
//начинаем новыю игру с очищением всех полей и отрисовкой поля для игры
function newGame() {
  wrapperForGame.innerHTML = "";
  winnerName.textContent = "";
  countClick = 0;

  let n = countCells.value;

  for (let i = 0; i < n; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < n; j++) {
      let td = document.createElement("td");
      td.classList.add("field");
      tr.append(td);
    }
    wrapperForGame.append(tr);
  }
  wrapperForGame.addEventListener("click", init);
}
//сама игра
function init(e) {
  if (!step) {
    stepCross(e.target);
  } else {
    stepZero(e.target);
  }
  step = !step;
  countClick++;
  win(); //проверяем на каждом клике есть ли выйгрышн. комбинация
}
//получаем массив с элементами которые будем проверять являются ли они выйгрышн.
function toGetAllAnswers() {
  let rows = wrapperForGame.rows;
  let horizontalAnswers = Array.from({ length: rows.length }, () => []);
  let verticalAnswers = Array.from({ length: rows.length }, () => []);
  let diagonal = [];
  let reverseDiagonal = [];
  let allAnswers = [];

  //все ответы по горизонтали
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows.length; j++) {
      horizontalAnswers[i].push(rows[i].cells[j]);
    }
  }
  //все ответы по вертикали
  for (let i = 0; i < horizontalAnswers.length; i++) {
    for (let j = 0; j < horizontalAnswers[i].length; j++) {
      verticalAnswers[i].push(horizontalAnswers[j][i]);
    }
  }
  //ответы по диагонали
  for (let i = 0; i < horizontalAnswers.length; i++) {
    diagonal.push(horizontalAnswers[i][i]);
  }
  //ответы по обратной диагонали
  for (let i = 0; i < horizontalAnswers.length; i++) {
    reverseDiagonal.push(
      horizontalAnswers[i][horizontalAnswers.length - 1 - i]
    );
  }
  allAnswers = allAnswers.concat(horizontalAnswers, verticalAnswers);
  allAnswers.push(diagonal, reverseDiagonal);
  return allAnswers;
}

function win() {
  let answers = toGetAllAnswers();

  answers.forEach((arr) => {
    if (isWinner(arr)) {
      addStyleWinner(arr);
      //если нет победителя и кликнули по всем ячейкам, то ничья
    } else if (!isWinner(arr) && countClick == Math.pow(countCells.value, 2)) {
      wrapperForGame.removeEventListener("click", init);
      winnerName.textContent = `Ничья!!!!`;
    }
  });
}
//проверяем наличие выйгрышн. комбинации
function isWinner(arr) {
  if (arr.every((item) => item.classList.contains("x"))) {
    wrapperForGame.removeEventListener("click", init);
    return true;
  } else if (arr.every((item) => item.classList.contains("o"))) {
    wrapperForGame.removeEventListener("click", init);
    return true;
  }
  return false;
}
//стилизация выйгрышн. комбинации с текстовым выводом победителя
function addStyleWinner(arr) {
  arr.forEach((item) => {
    item.style.backgroundColor = "#afeeee";

    let winnerX = item.classList.contains("x")
      ? (winnerName.textContent = `X победили!!!`)
      : (winnerName.textContent = `O победили!!!`);

    return winnerX;
  });
}
startBtn.addEventListener("click", newGame);
