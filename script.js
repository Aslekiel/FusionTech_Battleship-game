// Начало: построение сетки 10х10 для поля игрока и противника
const playerBoard = document.querySelector(".board-player");
const enemyBoard = document.querySelector(".board-enemy");

for (let y = 0; y < 10; y++) {
  const boardRow = document.createElement("div");
  boardRow.classList.add("board-row");
  boardRow.dataset.y = y;
  for (let x = 0; x < 10; x++) {
    const boardCell = document.createElement("div");
    boardCell.classList.add("board-cell");
    Object.assign(boardCell.dataset, { x, y });
    boardRow.append(boardCell);
  }
  playerBoard.append(boardRow);
}

// Конец: построение сетки 10х10 для поля игрока и противника

const cells = document.querySelectorAll(".board-cell");

let board = [];

for (let i = 0; i < 10; i++) {
  board.push([i]);
  for (let j = 0; j < board[i].length; j++) {
    board[i].length = 10;
    board[i].fill(0);
  }
}

// Начало: логика расположения для четырехпалубного корабля

const battleWagon = document.querySelector(".battle-wagon-ver");

battleWagon.onmousedown = function (event) {
  battleWagon.style.position = "absolute";
  battleWagon.style.zIndex = 1000;

  document.body.append(battleWagon);

  moveAt(event.pageX, event.pageY);

  function moveAt(pageX, pageY) {
    if (!battleWagon.classList.contains("battle-wagon-ver")) {
      battleWagon.style.left = pageX - battleWagon.offsetWidth / 8 + "px";
      battleWagon.style.top = pageY - battleWagon.offsetHeight / 2 + "px";
    } else {
      battleWagon.style.left = pageX - battleWagon.offsetWidth / 2 + "px";
      battleWagon.style.top = pageY - battleWagon.offsetHeight / 8 + "px";
    }
  }

  let currentDroppable = null;

  onMouseMove(event);

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);

    battleWagon.hidden = true;

    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

    battleWagon.hidden = false;

    if (!elemBelow) return;

    battleWagon.classList.add("active");

    let droppableBelow = elemBelow.closest(".board-cell");

    if (currentDroppable != droppableBelow) {
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        getCurrentXY(currentDroppable, battleWagon, onMouseMove);
      }
    }
  }

  document.addEventListener("mousemove", onMouseMove);

  battleWagon.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    battleWagon.onmouseup = null;
    alert("Увы, здесь корабль не поставить!");

    document.querySelector(".ship-selection__up").append(battleWagon);
    battleWagon.style.left = 50 + "px";
    battleWagon.style.top = 80 + "px";
  };

  battleWagon.ondragstart = function () {
    return false;
  };
};

// Начало: Поворот корабля

document.addEventListener("keydown", function (event) {
  if (event.keyCode == "32" && battleWagon.classList.contains("active")) {
    if (battleWagon.classList.contains("battle-wagon-ver")) {
      battleWagon.classList.remove("battle-wagon-ver");
      battleWagon.classList.add("battle-wagon-hor");
    } else {
      battleWagon.classList.add("battle-wagon-ver");
      battleWagon.classList.remove("battle-wagon-hor");
    }

    event.stopPropagation();
  }
});

// Конец: Поворот корабля

// Конец: логика расположения для четырехпалубного корабля

// Начало: логика расположения для трехпалубного корабля

const battleCasers = document.querySelectorAll(".battle-caser-ver");

battleCasers.forEach((battleCaser) => {
  battleCaser.onmousedown = function (event) {
    battleCaser.style.position = "absolute";
    battleCaser.style.zIndex = 1000;

    document.body.append(battleCaser);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      if (!battleCaser.classList.contains("battle-caser-ver")) {
        battleCaser.style.left = pageX - battleCaser.offsetWidth / 6 + "px";
        battleCaser.style.top = pageY - battleCaser.offsetHeight / 2 + "px";
      } else {
        battleCaser.style.left = pageX - battleCaser.offsetWidth / 2 + "px";
        battleCaser.style.top = pageY - battleCaser.offsetHeight / 6 + "px";
      }
    }

    let currentDroppable = null;

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);

      battleCaser.hidden = true;

      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

      battleCaser.hidden = false;

      if (!elemBelow) return;

      battleCaser.classList.add("active");

      let droppableBelow = elemBelow.closest(".board-cell");

      if (currentDroppable != droppableBelow) {
        currentDroppable = droppableBelow;
        if (currentDroppable) {
          getCurrentXY(currentDroppable, battleCaser, onMouseMove);
        }
      }
    }

    document.addEventListener("mousemove", onMouseMove);

    battleCaser.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      battleCaser.onmouseup = null;
      alert("Увы, здесь корабль не поставить!");
    };

    battleCaser.ondragstart = function () {
      return false;
    };
  };

  // Начало: Поворот корабля
  document.addEventListener("keydown", function (event) {
    if (event.keyCode == "32" && battleCaser.classList.contains("active")) {
      if (battleCaser.classList.contains("battle-caser-ver")) {
        battleCaser.classList.remove("battle-caser-ver");
        battleCaser.classList.add("battle-caser-hor");
      } else {
        battleCaser.classList.add("battle-caser-ver");
        battleCaser.classList.remove("battle-caser-hor");
      }

      event.stopPropagation();
    }
  });

  // Конец: Поворот корабля
});

// Конец: логика расположения для трехпалубного корабля

// Начало: логика расположения для двухпалубного корабля

const battleDestroyers = document.querySelectorAll(".battle-destroyer-ver");

battleDestroyers.forEach((battleDestroyer) => {
  battleDestroyer.onmousedown = function (event) {
    battleDestroyer.style.position = "absolute";
    battleDestroyer.style.zIndex = 1000;
    document.body.append(battleDestroyer);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      if (!battleDestroyer.classList.contains("battle-destroyer-ver")) {
        battleDestroyer.style.left =
          pageX - battleDestroyer.offsetWidth / 4 + "px";
        battleDestroyer.style.top =
          pageY - battleDestroyer.offsetHeight / 2 + "px";
      } else {
        battleDestroyer.style.left =
          pageX - battleDestroyer.offsetWidth / 2 + "px";
        battleDestroyer.style.top =
          pageY - battleDestroyer.offsetHeight / 4 + "px";
      }
    }

    let currentDroppable = null;

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);

      battleDestroyer.hidden = true;

      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

      battleDestroyer.hidden = false;

      if (!elemBelow) return;

      battleDestroyer.classList.add("active");

      let droppableBelow = elemBelow.closest(".board-cell");

      if (currentDroppable != droppableBelow) {
        currentDroppable = droppableBelow;

        if (currentDroppable) {
          getCurrentXY(currentDroppable, battleDestroyer, onMouseMove);
        }
      }
    }

    document.addEventListener("mousemove", onMouseMove);

    battleDestroyer.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      battleDestroyer.onmouseup = null;
      alert("Увы, здесь корабль не поставить!");
    };

    battleDestroyer.ondragstart = function () {
      return false;
    };
  };

  // Начало: Поворот корабля
  document.addEventListener("keydown", function (event) {
    if (event.keyCode == "32" && battleDestroyer.classList.contains("active")) {
      if (battleDestroyer.classList.contains("battle-destroyer-ver")) {
        battleDestroyer.classList.remove("battle-destroyer-ver");
        battleDestroyer.classList.add("battle-destroyer-hor");
      } else {
        battleDestroyer.classList.add("battle-destroyer-ver");
        battleDestroyer.classList.remove("battle-destroyer-hor");
      }

      event.stopPropagation();
    }
  });
  // Конец: Поворот корабля
});

// Конец: логика расположения для двухпалубного корабля

// Начало: логика расположения для однопалубного корабля

const battleBoats = document.querySelectorAll(".battle-boat");

battleBoats.forEach((battleBoat) => {
  battleBoat.onmousedown = function (event) {
    battleBoat.style.position = "absolute";
    battleBoat.style.zIndex = 1000;
    document.body.append(battleBoat);

    // Здесь вызывать функцию на remove block-field

    // cells.forEach((cell) => {
    //   someFunc(cell, elem);
    // });

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      battleBoat.style.left = pageX - battleBoat.offsetWidth / 2 + "px";
      battleBoat.style.top = pageY - battleBoat.offsetHeight / 2 + "px";
    }

    let currentDroppable = null;

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);

      battleBoat.hidden = true;

      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

      battleBoat.hidden = false;

      if (!elemBelow) return;

      let droppableBelow = elemBelow.closest(".board-cell");

      if (currentDroppable != droppableBelow) {
        currentDroppable = droppableBelow;

        if (currentDroppable) {
          getCurrentXY(currentDroppable, battleBoat, onMouseMove);
        }
      }
      return currentDroppable;
    }

    document.addEventListener("mousemove", onMouseMove);

    battleBoat.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      battleBoat.onmouseup = null;
      alert("Увы, здесь корабль не поставить!");
    };

    battleBoat.ondragstart = function () {
      return false;
    };
  };
});

// Конец: логика расположения для однопалубного корабля

// Начало: Получение местоположения корабля на доске

function getCurrentXY(elem, ship, onMouseMove) {
  ship.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    ship.classList.remove("active");
    playerBoard.style.position = "relative";
    playerBoard.append(ship);

    // Начало: Корабль не уходит за пределы поля
    if (
      ship.offsetWidth / 40 == ship.childElementCount &&
      elem.offsetLeft >= 360 - 40 * (ship.childElementCount - 1)
    ) {
      ship.style.left = 360 - 40 * (ship.childElementCount - 1) + "px";
      ship.style.top = elem.offsetTop + "px";
    } else if (
      ship.offsetHeight / 40 == ship.childElementCount &&
      elem.offsetTop >= 360 - 40 * (ship.childElementCount - 1)
    ) {
      ship.style.left = elem.offsetLeft + "px";
      ship.style.top = 360 - 40 * (ship.childElementCount - 1) + "px";
    } else {
      ship.style.left = elem.offsetLeft + "px";
      ship.style.top = elem.offsetTop + "px";
    }
    // Конец: Корабль не уходит за пределы поля

    getBoardFilling(ship, elem);
  };
}

// Конец: Получение местоположения корабля на доске

// ////////////////////////////////////////////////////////////

function getBoardFilling(ship, elem) {
  cells.forEach((cell) => {
    let currentCellX = cell.getBoundingClientRect().x;
    let currentCellY = cell.getBoundingClientRect().y;

    let currentPlayerBoardX = ship.getBoundingClientRect().x;
    let currentPlayerBoardY = ship.getBoundingClientRect().y;

    let coordinateX = cells[0].getBoundingClientRect().x;
    let coordinateY = cells[0].getBoundingClientRect().y;

    let initCellX = Math.floor(
      (currentPlayerBoardX - playerBoard.getBoundingClientRect().x - 2) / 40
    );
    let initCellY = Math.floor(
      (currentPlayerBoardY - playerBoard.getBoundingClientRect().y - 2) / 40
    );

    if (
      currentCellX == currentPlayerBoardX &&
      currentCellY == currentPlayerBoardY
    ) {
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
          if (
            i == (currentCellY - coordinateY) / 40 &&
            j == (currentCellX - coordinateX) / 40
          ) {
            if (ship.offsetWidth / 40 == 2) {
              board[i][j] = 1;
              board[i][j + 1] = 1;
            } else if (ship.offsetHeight / 40 == 2) {
              board[i][j] = 1;
              board[i + 1][j] = 1;
            } else if (ship.offsetWidth / 40 == 3) {
              board[i][j] = 1;
              board[i][j + 1] = 1;
              board[i][j + 2] = 1;
            } else if (ship.offsetHeight / 40 == 3) {
              board[i][j] = 1;
              board[i + 1][j] = 1;
              board[i + 2][j] = 1;
            } else if (ship.offsetWidth / 40 == 4) {
              board[i][j] = 1;
              board[i][j + 1] = 1;
              board[i][j + 2] = 1;
              board[i][j + 3] = 1;
            } else if (ship.offsetHeight / 40 == 4) {
              board[i][j] = 1;
              board[i + 1][j] = 1;
              board[i + 2][j] = 1;
              board[i + 3][j] = 1;
            } else {
              board[i][j] = 1;
            }
          }

          ship.addEventListener("mousedown", function () {
            if (
              i == (currentCellY - coordinateY) / 40 &&
              j == (currentCellX - coordinateX) / 40
            ) {
              if (ship.offsetWidth / 40 == 2) {
                board[i][j] = 0;
                board[i][j + 1] = 0;
              } else if (ship.offsetHeight / 40 == 2) {
                board[i][j] = 0;
                board[i + 1][j] = 0;
              } else if (ship.offsetWidth / 40 == 3) {
                board[i][j] = 0;
                board[i][j + 1] = 0;
                board[i][j + 2] = 0;
              } else if (ship.offsetHeight / 40 == 3) {
                board[i][j] = 0;
                board[i + 1][j] = 0;
                board[i + 2][j] = 0;
              } else if (ship.offsetWidth / 40 == 4) {
                board[i][j] = 0;
                board[i][j + 1] = 0;
                board[i][j + 2] = 0;
                board[i][j + 3] = 0;
              } else if (ship.offsetHeight / 40 == 4) {
                board[i][j] = 0;
                board[i + 1][j] = 0;
                board[i + 2][j] = 0;
                board[i + 3][j] = 0;
              } else {
                board[i][j] = 0;
              }
            }
          });
        }
      }
    }
    getEmptyField(ship, cell, initCellX, initCellY, elem);
  });
}

// Начало: Запрет постановки корабля на сам корабль и рядом стоящие ячейки

function getEmptyField(ship, cell, initCellX, initCellY, elem) {
  if (
    initCellX == elem.dataset.x &&
    initCellY == elem.dataset.y &&
    ship.offsetWidth / 40 == ship.childElementCount
  ) {
    // if (
    //   cell.dataset.x == Number(elem.dataset.x) + ship.childElementCount - 1 &&
    //   cell.dataset.y == elem.dataset.y &&
    //   cell.classList.contains("block-field")
    // ) {
    //   alert("Увы, здесь корабль не поставить!");
    //   console.log(elem);

    // document.querySelector(".ship-selection__up").append(ship);
    // }

    for (let y = initCellY - 1; y < initCellY + 2; y++) {
      for (
        let x = initCellX - 1;
        x < initCellX + ship.childElementCount + 1;
        x++
      ) {
        if (cell.dataset.x == x && cell.dataset.y == y) {
          cell.classList.add("block-field");
        }
      }
    }
  }

  if (
    initCellX == elem.dataset.x &&
    initCellY == elem.dataset.y &&
    ship.offsetHeight / 40 == ship.childElementCount
  ) {
    // if (
    //   cell.dataset.x == elem.dataset.x &&
    //   cell.dataset.y == Number(elem.dataset.y) + ship.childElementCount - 1 &&
    //   cell.classList.contains("block-field")
    // ) {
    //   alert("Увы, здесь корабль не поставить!");
    // }

    for (
      let y = initCellY - 1;
      y < initCellY + ship.childElementCount + 1;
      y++
    ) {
      for (let x = initCellX - 1; x < initCellX + 2; x++) {
        if (cell.dataset.x == x && cell.dataset.y == y) {
          cell.classList.add("block-field");
        }
      }
    }
  }
}

// Конец: Запрет постановки корабля на сам корабль и рядом стоящие ячейки

// Начало игры

const button = document.querySelector(".start-button");

button.addEventListener("click", function () {
  if (
    document.querySelector(".ship-selection__up").childElementCount == 0 &&
    document.querySelector(".ship-selection__down").childElementCount == 0
  ) {
    playerBoard.style.zIndex = -10;
    alert("Игра началась!");
  } else {
    alert("Не все корабли выставлены на поле!");
  }
});

////////////////////////////////////////////

console.log(board);

// Если ячейка, на которую ставится находится рядом с block-field, то поставка смещается на длину корабря -1

// document.addEventListener("click", function (event) {
//   console.log(event.target);
// });

// Начало: стрельба ИИ

function getRandomCoordinateShot(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// console.log(getRandomCoordinateShot(0, 9), getRandomCoordinateShot(0, 9));
// Конец: стрельба ИИ
