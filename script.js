const shipSelectionUp = document.querySelector(".ship-selection__up");
const shipSelectionDown = document.querySelector(".ship-selection__down");
const ships = document.querySelectorAll(".ship");

const playerBoard = document.querySelector(".board-player");
const enemyBoard = document.querySelector(".board-enemy");

const randomButton = document.querySelector(".random-position-button");
const independentButton = document.querySelector(
  ".independent-position-button"
);
const startButton = document.querySelector(".start-button");

const boardFriendly = [];

for (let i = 0; i < 10; i++) {
  boardFriendly.push([i]);
  for (let j = 0; j < boardFriendly[i].length; j++) {
    boardFriendly[i].length = 10;
    boardFriendly[i].fill(0);
  }
}

const enemyBoardMatrix = [];

for (let i = 0; i < 10; i++) {
  enemyBoardMatrix.push([i]);
  for (let j = 0; j < enemyBoardMatrix[i].length; j++) {
    enemyBoardMatrix[i].length = 10;
    enemyBoardMatrix[i].fill(0);
  }
}

const battlefildPlayer = [];
const battlefildEnemy = [];

for (let i = 0; i < 10; i++) {
  battlefildPlayer[i] = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g",
    7: "h",
    8: "i",
    9: "j",
  };
  battlefildEnemy[i] = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g",
    7: "h",
    8: "i",
    9: "j",
  };
}

// Начало: построение сетки 10х10 для поля игрока и противника

for (let y = 0; y < 10; y++) {
  const boardRow = document.createElement("div");
  boardRow.classList.add("board-row");
  boardRow.dataset.y = y;
  for (let x = 0; x < 10; x++) {
    const boardCell = document.createElement("div");
    boardCell.classList.add("board-cell");
    Object.assign(boardCell.dataset, { x, y });
    boardRow.append(boardCell);
    boardCell.dataset.flag = "on";
    boardCell.dataset.isWounded = "none";
  }
  playerBoard.append(boardRow);
}

for (let y = 0; y < 10; y++) {
  const boardRow = document.createElement("div");
  boardRow.classList.add("board-row");
  boardRow.dataset.y = y;
  for (let x = 0; x < 10; x++) {
    const boardCell = document.createElement("div");
    boardCell.classList.add("board-cell__enemy");
    Object.assign(boardCell.dataset, { x, y });
    boardRow.append(boardCell);
    boardCell.dataset.flag = "on";
  }
  enemyBoard.append(boardRow);
}

// Конец: построение сетки 10х10 для поля игрока и противника

const cellsFriendly = document.querySelectorAll(".board-cell");

const cellsEnemy = document.querySelectorAll(".board-cell__enemy");

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
  };

  battleWagon.ondragstart = function () {
    return false;
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
};

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
    };

    battleBoat.ondragstart = function () {
      return false;
    };
  };
});

// Конец: логика расположения для однопалубного корабля

// Начало: Расположение корабля на доске

function getCurrentXY(currentDroppable, ship, onMouseMove) {
  ship.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    ship.classList.remove("active");
    playerBoard.style.position = "relative";
    playerBoard.append(ship);

    getPlacement(currentDroppable, ship, battlefildPlayer, boardFriendly);
  };
}

// Конец: Расположение корабля на доске

// Начало: Заполнение матрицы координатами

function getPlacement(currentDroppable, ship, battlefield, board) {
  [cx, cy] = [currentDroppable.dataset.x, currentDroppable.dataset.y];

  if (ship.offsetWidth / 40 == ship.childElementCount) {
    [lastShipDeckCx, lastShipDeckCy] = [
      parseInt(cx) + ship.childElementCount - 1,
      parseInt(cy),
    ];
  } else if (ship.offsetHeight / 40 == ship.childElementCount) {
    [lastShipDeckCx, lastShipDeckCy] = [
      parseInt(cx),
      parseInt(cy) + ship.childElementCount - 1,
    ];
  }

  for (let item in battlefield) {
    for (let key in battlefield[item]) {
      if (
        (cx == key && cy == battlefield[item][key]) ||
        (lastShipDeckCx == key && lastShipDeckCy == battlefield[item][key])
      ) {
        document.querySelector(".ship-selection").append(ship);
        return;
      } else {
        ship.style.left = currentDroppable.offsetLeft + "px";
        ship.style.top = currentDroppable.offsetTop + "px";
      }
    }
  }

  if (
    (boardFriendly.length - cx < ship.childElementCount &&
      ship.offsetWidth / 40 == ship.childElementCount) ||
    (boardFriendly.length - cy < ship.childElementCount &&
      ship.offsetHeight / 40 == ship.childElementCount)
  ) {
    document.querySelector(".ship-selection").append(ship);
    return;
  }

  if (ship.offsetWidth / 40 == ship.childElementCount) {
    for (let y = parseInt(cy) - 1; y < parseInt(cy) + 2; y++) {
      for (
        let x = parseInt(cx) - 1;
        x < parseInt(cx) + ship.childElementCount + 1;
        x++
      ) {
        for (let item in battlefield) {
          if (item == y) {
            for (let key in battlefield[item]) {
              if (key == x) {
                key = x;
                battlefield[item][key] = y;
              }
            }
          }
        }
        for (let k = 0; k < ship.childElementCount; k++) {
          if (cy == y && cx == x) {
            board[y][x + k] = 1;
          }
        }
      }
    }
  } else {
    for (
      let y = parseInt(cy) - 1;
      y < parseInt(cy) + ship.childElementCount + 1;
      y++
    ) {
      for (let x = parseInt(cx) - 1; x < parseInt(cx) + 2; x++) {
        for (let item in battlefield) {
          if (item == y) {
            for (let key in battlefield[item]) {
              if (key == x) {
                key = x;
                battlefield[item][key] = y;
              }
            }
          }
        }
        for (let k = 0; k < ship.childElementCount; k++) {
          if (cy == y && cx == x) {
            board[y + k][x] = 1;
          }
        }
      }
    }
  }

  return battlefield;
}

// Конец: Заполнение матрицы координатами

/////////////////////////////////////////////////////////////////////////////////////////////

// Начало игры

startButton.addEventListener("click", function () {
  if (
    (document.querySelector(".ship-selection__up").childElementCount == 0 &&
      document.querySelector(".ship-selection__down").childElementCount == 0) ||
    (shipSelectionUp.style.zIndex == -10 &&
      shipSelectionDown.style.zIndex == -10)
  ) {
    playerBoard.style.zIndex = -10;
    enemyBoard.style.zIndex = 0;
    alert("Игра началась!");

    // TEST //

    for (let i = 0; i < enemyBoardMatrix.length; i++) {
      for (let j = 0; j < enemyBoardMatrix.length; j++) {
        cellsEnemy.forEach((cell) => {
          if (enemyBoardMatrix[i][j] !== 0) {
            if (j == cell.dataset.x && i == cell.dataset.y) {
              cell.style.backgroundColor = "green";
              cell.style.border = "1px solid grey";
            }
          }
        });
      }
    }

    // TEST //

    alert("Сделай свой ход!");
  } else {
    alert("Не все корабли выставлены на поле!");
  }
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

independentButton.addEventListener("click", function () {
  for (let i = 0; i < 10; i++) {
    battlefildPlayer[i] = {
      0: "a",
      1: "b",
      2: "c",
      3: "d",
      4: "e",
      5: "f",
      6: "g",
      7: "h",
      8: "i",
      9: "j",
    };

    for (let j = 0; j < boardFriendly.length; j++) {
      cellsFriendly.forEach((cell) => (cell.style.backgroundColor = ""));
      boardFriendly[i][j] = 0;
    }
    ships.forEach((ship) => (ship.style.display = ""));
    shipSelectionUp.style.zIndex = 0;
    shipSelectionDown.style.zIndex = 0;
  }
  event.preventDefault();
});

randomButton.addEventListener("click", function (event) {
  event.preventDefault();

  for (let i = 0; i < 10; i++) {
    battlefildPlayer[i] = {
      0: "a",
      1: "b",
      2: "c",
      3: "d",
      4: "e",
      5: "f",
      6: "g",
      7: "h",
      8: "i",
      9: "j",
    };

    for (let j = 0; j < boardFriendly.length; j++) {
      cellsFriendly.forEach((cell) => (cell.style.backgroundColor = ""));
      boardFriendly[i][j] = 0;
    }
  }

  getRandomPlacement(4, battlefildPlayer, boardFriendly);
  getRandomPlacement(3, battlefildPlayer, boardFriendly);
  getRandomPlacement(3, battlefildPlayer, boardFriendly);
  getRandomPlacement(2, battlefildPlayer, boardFriendly);
  getRandomPlacement(2, battlefildPlayer, boardFriendly);
  getRandomPlacement(2, battlefildPlayer, boardFriendly);
  getRandomPlacement(1, battlefildPlayer, boardFriendly);
  getRandomPlacement(1, battlefildPlayer, boardFriendly);
  getRandomPlacement(1, battlefildPlayer, boardFriendly);
  getRandomPlacement(1, battlefildPlayer, boardFriendly);

  for (let i = 0; i < boardFriendly.length; i++) {
    for (let j = 0; j < boardFriendly.length; j++) {
      cellsFriendly.forEach((cell) => {
        if (boardFriendly[i][j] !== 0) {
          if (j == cell.dataset.x && i == cell.dataset.y) {
            cell.style.backgroundColor = "rgb(65, 186, 168)";
            cell.style.border = "1px solid grey";

            shipSelectionUp.style.zIndex = -10;
            shipSelectionDown.style.zIndex = -10;

            ships.forEach((ship) => (ship.style.display = "none"));
          }
        }
      });
    }
  }

  // TEST //

  for (let i = 0; i < enemyBoardMatrix.length; i++) {
    for (let j = 0; j < enemyBoardMatrix.length; j++) {
      cellsEnemy.forEach((cell) => {
        if (enemyBoardMatrix[i][j] !== 0) {
          if (j == cell.dataset.x && i == cell.dataset.y) {
            cell.style.backgroundColor = "green";
            cell.style.border = "1px solid grey";
          }
        }
      });
    }
  }

  // TEST //
});

// Начало: заполнение матрицы постановки кораблей противника

getRandomPlacement(4, battlefildEnemy, enemyBoardMatrix);
getRandomPlacement(3, battlefildEnemy, enemyBoardMatrix);
getRandomPlacement(3, battlefildEnemy, enemyBoardMatrix);
getRandomPlacement(2, battlefildEnemy, enemyBoardMatrix);
getRandomPlacement(2, battlefildEnemy, enemyBoardMatrix);
getRandomPlacement(2, battlefildEnemy, enemyBoardMatrix);
getRandomPlacement(1, battlefildEnemy, enemyBoardMatrix);
getRandomPlacement(1, battlefildEnemy, enemyBoardMatrix);
getRandomPlacement(1, battlefildEnemy, enemyBoardMatrix);
getRandomPlacement(1, battlefildEnemy, enemyBoardMatrix);

enemyBoard.style.zIndex = -10;

function getRandomPlacement(shipDeck, battlefield, boardMatrix) {
  [cx, cy] = [getRandomInt(0, 10), getRandomInt(0, 10)];

  let direction = getRandomInt(0, 2);

  if (direction == 1) {
    [lastShipDeckCx, lastShipDeckCy] = [cx + shipDeck - 1, cy];
  } else if (direction == 0) {
    [lastShipDeckCx, lastShipDeckCy] = [cx, cy + shipDeck - 1];
  }

  for (let item in battlefield) {
    for (let key in battlefield[item]) {
      if (
        (cx == key && cy == battlefield[item][key]) ||
        (lastShipDeckCx == key && lastShipDeckCy == battlefield[item][key])
      ) {
        return getRandomPlacement(shipDeck, battlefield, boardMatrix);
      }
    }
  }

  if (
    (boardMatrix.length - cx < shipDeck && direction == 1) ||
    (boardMatrix.length - cy < shipDeck && direction == 0)
  ) {
    return getRandomPlacement(shipDeck, battlefield, boardMatrix);
  }

  if (direction == 1) {
    for (let y = cy - 1; y < cy + 2; y++) {
      for (let x = cx - 1; x < cx + shipDeck + 1; x++) {
        for (let item in battlefield) {
          if (item == y) {
            for (let key in battlefield[item]) {
              if (key == x) {
                key = x;
                battlefield[item][key] = y;
              }
            }
          }
        }
        for (let k = 1; k <= shipDeck; k++) {
          if (cy == y && cx == x) {
            boardMatrix[y][x + k - 1] = shipDeck;
          }
        }
      }
    }
  } else {
    for (let y = cy - 1; y < cy + shipDeck + 1; y++) {
      for (let x = cx - 1; x < cx + 2; x++) {
        for (let item in battlefield) {
          if (item == y) {
            for (let key in battlefield[item]) {
              if (key == x) {
                key = x;
                battlefield[item][key] = y;
              }
            }
          }
        }
        for (let k = 1; k <= shipDeck; k++) {
          if (cy == y && cx == x) {
            boardMatrix[y + k - 1][x] = shipDeck;
          }
        }
      }
    }
  }

  return boardMatrix;
}

// Конец: заполнение матрицы постановки кораблей противника

console.log(boardFriendly);
console.log(enemyBoardMatrix);

// Начало: Уничтожение кораблей противника

let countObj = { 1: 0, 2: 0, 3: 0, 4: 0 };

enemyBoard.addEventListener("click", function (event) {
  let currentCellVar =
    enemyBoardMatrix[event.target.dataset.y][event.target.dataset.x];

  if (enemyBoardMatrix[event.target.dataset.y][event.target.dataset.x] !== 0) {
    for (let key in countObj) {
      if (key == currentCellVar) {
        countObj[key]++;
      }
      if (countObj[key] > key && key == currentCellVar) {
        countObj[key] = 1;
      }
    }
  }

  if (enemyBoardMatrix[event.target.dataset.y][event.target.dataset.x] !== 0) {
    for (
      let y = parseInt(event.target.dataset.y) - 1;
      y < parseInt(event.target.dataset.y) + 2;
      y++
    ) {
      for (
        let x = parseInt(event.target.dataset.x) - 1;
        x < parseInt(event.target.dataset.x) + 2;
        x++
      ) {
        if (x >= 0 && y >= 0 && x < 10 && y < 10) {
          cellsEnemy.forEach((cell) => {
            if (
              cell.dataset.x == x &&
              cell.dataset.y == y &&
              enemyBoardMatrix[y][x] == 0
            ) {
              cell.dataset.flag = "off";
            }
          });

          if (
            (x !== parseInt(event.target.dataset.x) &&
              y == parseInt(event.target.dataset.y)) ||
            (x == parseInt(event.target.dataset.x) &&
              y !== parseInt(event.target.dataset.y))
          ) {
            event.target.style.backgroundColor = "red";
            event.target.style.border = "1px solid gray";
            event.target.style.zIndex = -10;
          }
        }
      }
    }
  } else if (
    enemyBoardMatrix[event.target.dataset.y][event.target.dataset.x] == 0
  ) {
    event.target.style.backgroundColor = "yellow";
    event.target.style.border = "1px solid gray";
    event.target.style.zIndex = -10;
    event.target.dataset.flag = "off";
    console.log("Мимо!");
  }

  for (let key in countObj) {
    if (countObj[key] == currentCellVar && key == currentCellVar) {
      cellsEnemy.forEach((cell) => {
        if (cell.dataset.flag == "off") {
          cell.style.backgroundColor = "yellow";
          cell.style.zIndex = -10;
        }
      });
    }
  }
});

// Конец: Уничтожение кораблей противника

// Начало: стрельба ИИ

enemyBoard.addEventListener("click", checkShot);

let verifiedCoodinateCell;
let prevCoordinateCell;

function checkShot(event) {
  currentX = event.target.dataset.x;
  currentY = event.target.dataset.y;
  if (enemyBoardMatrix[currentY][currentX] == 0) {
    shotCell(boardFriendly, cellsFriendly);
  }
}

let hitShot = false;
let secondShot = false;

function shotCell(board, cellsArr) {
  if (!hitShot && !secondShot) {
    [cx, cy] = [getRandomInt(0, 10), getRandomInt(0, 10)];
  } else if (hitShot) {
    [cx, cy] = [prevCoordinateCell[1], prevCoordinateCell[0]];
  } else if (secondShot) {
    [cx, cy] = [verifiedCoodinateCell[1], verifiedCoodinateCell[0]];
  }

  console.log([cy, cx], prevCoordinateCell, verifiedCoodinateCell);

  hitShot = false;

  let recurringCell = false;

  cellsArr.forEach((cell) => {
    if (
      cell.dataset.y == cy &&
      cell.dataset.x == cx &&
      cell.dataset.flag == "off" &&
      cell.dataset.isWounded !== "yes" &&
      cell.style.backgroundColor == "red" &&
      cell.style.backgroundColor == "yellow"
    ) {
      if (!recurringCell) {
        shotCell(board, cellsArr);
        recurringCell = true;
      }
    }
    if (cell.dataset.y == cy && cell.dataset.x == cx && board[cy][cx] == 0) {
      // for (let key in countObjWoundedDeck) {
      //   if (key == board[cy][cx]) {
      //     countObjWoundedDeck[key]++;
      //   }
      //   if (countObjWoundedDeck[key] > key && key == board[cy][cx]) {
      //     countObjWoundedDeck[key] = 0;
      //   }
      // }

      enemyBoard.style.zIndex = -10;
      setTimeout(() => {
        cell.style.backgroundColor = "yellow";
        enemyBoard.style.zIndex = 0;
        cell.dataset.flag = "off";
      }, 500);
    } else if (
      cell.dataset.y == cy &&
      cell.dataset.x == cx &&
      board[cy][cx] !== 0
    ) {
      enemyBoard.style.zIndex = -10;
      setTimeout(() => {
        cell.style.backgroundColor = "red";
        enemyBoard.style.zIndex = 0;
        cell.dataset.flag = "off";
        cell.dataset.isWounded = "yes";

        // if (!verifiedCoodinateCell && !prevCoordinateCell) {
        //   checkAroundCell(cy, cx, boardFriendly, cellsFriendly);
        //   checkShipDeck(
        //     verifiedCoodinateCell,
        //     prevCoordinateCell,
        //     cellsFriendly,
        //     boardFriendly
        //   );
        // } else {
        //   checkVertical(cy, cx, boardFriendly, cellsFriendly);
        //   checkShipDeck(
        //     verifiedCoodinateCell,
        //     prevCoordinateCell,
        //     cellsFriendly,
        //     boardFriendly
        //   );

        // }
        checkAroundCell(cy, cx, boardFriendly, cellsFriendly);
        checkShipDeck(
          verifiedCoodinateCell,
          prevCoordinateCell,
          cellsFriendly,
          boardFriendly
        );
      }, 500);
    }
  });
}

function checkAroundCell(cy, cx, board, cellsArr) {
  let currentCellArr = [];
  let filterArr = [];

  cellsArr.forEach((cell) => {
    if (cell.dataset.x == cx && cell.dataset.y == cy) {
      for (let y = cy - 1; y < cy + 2; y++) {
        for (let x = cx - 1; x < cx + 2; x++) {
          if (x >= 0 && y >= 0 && x < 10 && y < 10) {
            if ((cx !== x && cy == y) || (cx == x && cy !== y)) {
              currentCellArr.push([y, x]);
            }
          }
        }
      }
    }
  });
  cellsArr.forEach((cell) => {
    for (let key in currentCellArr) {
      if (
        cell.dataset.x == currentCellArr[key][1] &&
        cell.dataset.y == currentCellArr[key][0]
      ) {
        if (cell.dataset.flag !== "off" && cell.dataset.isWounded !== "yes") {
          filterArr.push([currentCellArr[key][0], currentCellArr[key][1]]);
        }
      }
    }
  });

  randomCell = Math.floor(Math.random() * filterArr.length);

  // Посмотреть этот момент

  if (filterArr.length !== 0) {
    prevCoordinateCell = [cy, cx];
    verifiedCoodinateCell = [
      filterArr[randomCell][0],
      filterArr[randomCell][1],
    ];
  } else {
    hitShot = false;
    secondShot = false;
    shotCell(board, cellsArr);
  }
}

// function checkVertical(cy, cx, boardFriendly, cellsArr) {
//   cellsArr.forEach((cell) => {
//     if (cell.dataset.x == cx && cell.dataset.y == cy) {
//       for (let y = cy - 1; y < cy + 2; y++) {
//         if (cx >= 0 && y >= 0 && cx < 10 && y < 10) {
//           console.log([y, cx]);
//         }
//       }
//     }
//   });
// }

// let countObjWoundedDeck = { 1: 0, 2: 0, 3: 0, 4: 0 };

function checkShipDeck(
  verifiedCoodinateCell,
  prevCoordinateCell,
  cellsFriendly,
  boardFriendly
) {
  let currentY = verifiedCoodinateCell[0];
  let currentX = verifiedCoodinateCell[1];

  let prevY = prevCoordinateCell[0];
  let prevX = prevCoordinateCell[1];

  cellsFriendly.forEach((cell) => {
    if (
      cell.dataset.x == currentX &&
      cell.dataset.y == currentY &&
      boardFriendly[currentY][currentX] == 0
    ) {
      hitShot = true;
    }

    if (
      cell.dataset.x == currentX &&
      cell.dataset.y == currentY &&
      boardFriendly[prevY][prevX] == 1
    ) {
      console.log("однопалубный потоплен");
      enemyBoard.style.zIndex = -10;
      hitShot = false;
      setTimeout(() => {
        enemyBoard.style.zIndex = 0;
        shotCell(boardFriendly, cellsFriendly);
      }, 500);
    }

    if (
      cell.dataset.x == currentX &&
      cell.dataset.y == currentY &&
      boardFriendly[currentY][currentX] !== 0
    ) {
      enemyBoard.style.zIndex = -10;

      setTimeout(() => {
        cell.style.backgroundColor = "red";
        enemyBoard.style.zIndex = 0;
        cell.dataset.flag = "off";
        cell.dataset.isWounded = "yes";
      }, 500);
      if (
        boardFriendly[currentY][currentX] == 4 &&
        boardFriendly[prevY][prevX] == 4
      ) {
        secondShot = true;
        hitShot = false;
        enemyBoard.style.zIndex = -10;

        setTimeout(() => {
          enemyBoard.style.zIndex = 0;
          shotCell(boardFriendly, cellsFriendly);
        }, 500);
      } else if (
        boardFriendly[currentY][currentX] == 3 &&
        boardFriendly[prevY][prevX] == 3
      ) {
        secondShot = true;
        hitShot = false;
        enemyBoard.style.zIndex = -10;

        setTimeout(() => {
          enemyBoard.style.zIndex = 0;
          shotCell(boardFriendly, cellsFriendly);
        }, 500);
      } else if (
        boardFriendly[currentY][currentX] == 2 &&
        boardFriendly[prevY][prevX] == 2
      ) {
        console.log("двухпалубный потоплен");

        hitShot = false;
        enemyBoard.style.zIndex = -10;
        setTimeout(() => {
          enemyBoard.style.zIndex = 0;
          shotCell(boardFriendly, cellsFriendly);
        }, 500);
      }
    } else if (
      cell.dataset.x == currentX &&
      cell.dataset.y == currentY &&
      boardFriendly[currentY][currentX] == 0 &&
      boardFriendly[prevY][prevX] !== 1
    ) {
      enemyBoard.style.zIndex = -10;
      setTimeout(() => {
        cell.style.backgroundColor = "yellow";
        enemyBoard.style.zIndex = 0;
        cell.dataset.flag = "off";
      }, 500);
    }
  });
}

////////////////////////////////////

// let shotCellFlag = false;

// function checkAroundCell(cx, cy, currentCell, board, cellsArr) {
//   let currentCellArr = [];

//   for (
//     let y = parseInt(currentCell.dataset.y) - 1;
//     y < parseInt(currentCell.dataset.y) + 2;
//     y++
//   ) {
//     for (
//       let x = parseInt(currentCell.dataset.x) - 1;
//       x < parseInt(currentCell.dataset.x) + 2;
//       x++
//     ) {
//       if (x >= 0 && y >= 0 && x < 10 && y < 10) {
//         if ((cx !== x && cy == y) || (cx == x && cy !== y)) {
//           // if (currentCell.dataset.flag == "on") {
//           //   console.log([y, x]);
//           //   currentCellArr.push([y, x]);
//           // }
//           if (currentCell.dataset.x == cx && currentCell.dataset.y == cy) {
//             console.log([y, x]);
//           }

//           currentCellArr.push([y, x]);
//         }
//       }
//     }
//   }
//   let randomCell = Math.floor(Math.random() * currentCellArr.length);

//   console.log(currentCellArr);
//   console.log(randomCell);
//   console.log(
//     board[currentCellArr[randomCell][0]][currentCellArr[randomCell][1]]
//   );

//   if (
//     board[currentCellArr[randomCell][0]][currentCellArr[randomCell][1]] !== 0
//   ) {
//     cellsArr.forEach((cell) => {
//       if (
//         cell.dataset.x == currentCellArr[randomCell][1] &&
//         cell.dataset.y == currentCellArr[randomCell][0]
//       ) {
//         console.log("Popal");
//         console.log([cy, cx]);
//         console.log(
//           currentCellArr[randomCell][0],
//           currentCellArr[randomCell][1]
//         );
//         setTimeout(() => {
//           cell.style.backgroundColor = "blue";
//           cell.dataset.flag = "off";
//           // checkNextShot(
//           //   currentCellArr[randomCell][0],
//           //   currentCellArr[randomCell][1],
//           //   cy,
//           //   cx,
//           //   cellsArr,
//           //   board
//           // );
//         }, 500);

//         //Вызывется функция
//       }
//     });
//   } else if (board[cy][cx] == 1) {
//     for (let y = cy - 1; y < cy + 2; y++) {
//       for (let x = cx - 1; x < cx + 2; x++) {
//         if (x >= 0 && y >= 0 && x < 10 && y < 10) {
//           cellsArr.forEach((cell) => {
//             if (cell.dataset.x == x && cell.dataset.y == y) {
//               cell.style.backgroundColor = "yellow";
//               cell.dataset.flag = "off";
//             } else if (cx == cell.dataset.x && cy == cell.dataset.y) {
//               cell.style.backgroundColor = "red";
//               cell.dataset.flag = "off";
//               enemyBoard.style.zIndex = -10;

//               shotCellFlag = false;

//               setTimeout(() => {
//                 if (!shotCellFlag) {
//                   shotCell(board, cellsArr);
//                   enemyBoard.style.zIndex = 0;
//                   shotCellFlag = true;
//                 }
//               }, 1000);
//             }
//           });
//         }
//       }
//     }
//   } else if (
//     board[currentCellArr[randomCell][0]][currentCellArr[randomCell][1]] == 0
//   ) {
//     cellsArr.forEach((cell) => {
//       if (
//         cell.dataset.x == currentCellArr[randomCell][1] &&
//         cell.dataset.y == currentCellArr[randomCell][0]
//       ) {
//         prevXYArr.push([cy, cx]);

//         enemyBoard.style.zIndex = -10;
//         setTimeout(() => {
//           cell.style.backgroundColor = "yellow";
//           enemyBoard.style.zIndex = 0;
//           cell.dataset.flag = "off";
//         }, 500);

//         // Передача хода
//         //
//         // hitShot = true;
//         // checkNextCell(cy, cx);
//       }
//     });
//   }
// }

// function checkNextShot(curY, curX, prevY, prevX, cellsArr, board) {
//   if (curX == prevX) {
//     let currentCellArr = [];

//     cellsArr.forEach((cell) => {
//       if (
//         cell.dataset.y == curX &&
//         cell.dataset.x == curY &&
//         board[curY][curX] !== 0
//       ) {
//         console.log("popal ewe raz");
//         // for (
//         //   let y = parseInt(cell.dataset.y) - 1;
//         //   y < parseInt(cell.dataset.y) + 2;
//         //   y++
//         // ) {
//         //   for (
//         //     let x = parseInt(cell.dataset.x) - 1;
//         //     x < parseInt(cell.dataset.x) + 2;
//         //     x++
//         //   ) {
//         //     if (x >= 0 && y >= 0 && x < 10 && y < 10) {
//         //       if ((curX !== x && curY == y) || (curX == x && curY !== y)) {
//         //         console.log("popal ewe raz");
//         //         console.log([y, x]);

//         //         currentCellArr.push([y, x]);
//         //       }
//         //     }
//         //   }
//         // }
//       }
//     });
//     let randomCell = Math.floor(Math.random() * currentCellArr.length);
//   }

//   cellsArr.forEach((cell) => {
//     if (cell.dataset.flag !== "off") {
//     }
//   });
// }

// //////////////////////////////////////////

// enemyBoard.addEventListener("click", checkShot);

// function checkShot(event) {
//   currentX = event.target.dataset.x;
//   currentY = event.target.dataset.y;
//   if (enemyBoardMatrix[currentY][currentX] == 0) {
//     getShot(boardFriendly, cellsFriendly);
//   } else {
//   }
// }

// function getShot(boardMatrix, cells) {
//   [cx, cy] = [getRandomInt(0, 10), getRandomInt(0, 10)];

//   cells.forEach((cell) => {
//     if (
//       cell.dataset.x == cx &&
//       cell.dataset.y == cy &&
//       cell.dataset.flag !== "on"
//     ) {
//       console.log("test");
//       getShot(boardMatrix, cells);
//     }
//   });

//   if (boardMatrix[cy][cx] == 0) {
//     cells.forEach((cell) => {
//       if (cell.dataset.x == cx && cell.dataset.y == cy) {
//         cell.style.backgroundColor = "yellow";
//         cell.dataset.flag = "off";
//       }
//     });
//   } else if (boardMatrix[cy][cx] == 1) {
//     for (let y = cy - 1; y < cy + 2; y++) {
//       for (let x = cx - 1; x < cx + 2; x++) {
//         if (x >= 0 && y >= 0 && x < 10 && y < 10) {
//           cells.forEach((cell) => {
//             if (cell.dataset.x == x && cell.dataset.y == y) {
//               cell.style.backgroundColor = "yellow";
//               cell.dataset.flag = "off";
//               console.log([y, x]);
//             } else if (cx == cell.dataset.x && cy == cell.dataset.y) {
//               cell.style.backgroundColor = "red";
//               cell.dataset.flag = "sunk";

//               enemyBoard.style.zIndex = -10;

//               setTimeout(() => {
//                 getShot(boardMatrix, cells);
//                 enemyBoard.style.zIndex = 0;
//               }, 1000);
//             }
//           });
//         }
//       }
//     }
//   }
//   // else {
//   //   cells.forEach((cell) => {
//   //     if (cell.dataset.x == cx && cell.dataset.y == cy) {
//   //       cell.style.backgroundColor = "red";
//   //       cell.dataset.flag = "off";

//   //       console.log([cy, cx]);

//   //       // enemyBoard.style.zIndex = -10;
//   //       // setTimeout(() => {
//   //       //   checkAroundCell(cell, cells, cx, cy, boardMatrix);
//   //       //   enemyBoard.style.zIndex = 0;
//   //       // }, 2000);
//   //     }
//   //   });
//   // }
// }

// function checkAroundCell(cell, cells, cx, cy, boardMatrix) {
//   let aroundCell = [];

//   someFunc(cell, cx, cy);
//   function someFunc(cell, cx, cy) {
//     for (
//       let y = parseInt(cell.dataset.y) - 1;
//       y < parseInt(cell.dataset.y) + 2;
//       y++
//     ) {
//       for (
//         let x = parseInt(cell.dataset.x) - 1;
//         x < parseInt(cell.dataset.x) + 2;
//         x++
//       ) {
//         if (x >= 0 && y >= 0 && x < 10 && y < 10) {
//           if ((cx !== x && cy == y) || (cx == x && cy !== y)) {
//             aroundCell.push([y, x]);
//           }
//         }
//       }
//     }
//   }

//   let randomRow = Math.floor(Math.random() * aroundCell.length);

//   console.log([aroundCell[randomRow][0], aroundCell[randomRow][1]]);
//   if (boardMatrix[aroundCell[randomRow][0]][aroundCell[randomRow][1]] !== 0) {
//     cells.forEach((cell) => {
//       if (
//         cell.dataset.x == aroundCell[randomRow][1] &&
//         cell.dataset.y == aroundCell[randomRow][0]
//       ) {
//         cell.style.backgroundColor = "red";
//         cell.dataset.flag = "off";

//         someFunc(cell, aroundCell[randomRow][1], aroundCell[randomRow][0]);
//       }
//     });
//   } else {
//     cells.forEach((cell) => {
//       if (
//         cell.dataset.x == aroundCell[randomRow][1] &&
//         cell.dataset.y == aroundCell[randomRow][0]
//       ) {
//         cell.style.backgroundColor = "blue";
//         cell.dataset.flag = "off";

//         someFunc(cell, cx, cy);
//       }
//     });
//   }
// }

// Конец: стрельба ИИ
