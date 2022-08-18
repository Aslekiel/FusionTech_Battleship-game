const shipSelectionUp = document.querySelector(".ship-selection__up");
const shipSelectionDown = document.querySelector(".ship-selection__down");
const ships = document.querySelectorAll(".ship");

const wagon = document.querySelector(".ship__wagon");
const casers = document.querySelectorAll(".ship__caser");
const destroyers = document.querySelectorAll(".ship__destroyer");
const boats = document.querySelectorAll(".ship__boat");

const playerBoard = document.querySelector(".board-player");
const enemyBoard = document.querySelector(".board-enemy");

const randomButton = document.querySelector(".random-position-button");
const independentButton = document.querySelector(
  ".independent-position-button"
);
const startButton = document.querySelector(".start-button");

const shipNames = { 1: "boat", 2: "destroyer", 3: "caser", 4: "wagon" };
const shipsOnBoardArray = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

// Начало: Построение матрицы для игры

const boardFriendly = [];
const enemyBoardMatrix = [];

getEmptyMatrix(boardFriendly);
getEmptyMatrix(enemyBoardMatrix);

function getEmptyMatrix(field) {
  for (let i = 0; i < 10; i++) {
    field.push([i]);

    for (let j = 0; j < field[i].length; j++) {
      field[i].length = 10;
      field[i].fill(0);
    }
  }
  return field;
}

// Конец: Построение матрицы для игры

// Начало: Построение поля с расположением кораблей и зон запрета их установки

const battlefieldPlayer = [];
const battlefieldEnemy = [];

getFullBattlefieldMatrix(battlefieldPlayer);
getFullBattlefieldMatrix(battlefieldEnemy);

function getFullBattlefieldMatrix(battlefield) {
  for (let i = 0; i < 10; i++) {
    battlefield.push({});
    for (let j = 0; j < 10; j++) {
      battlefield[i][j] = "a";
    }
  }
  return battlefield;
}

// Конец: Построение поля с расположением кораблей и зон запрета их установки

// Начало: построение сетки 10х10 для поля игрока и противника

getPlayingField(playerBoard);
getPlayingField(enemyBoard);

function getPlayingField(field) {
  for (let y = 0; y < 10; y++) {
    const boardRow = document.createElement("div");
    boardRow.classList.add("board-row");
    for (let x = 0; x < 10; x++) {
      const boardCell = document.createElement("div");
      if (field == enemyBoard) {
        boardCell.classList.add("board-cell__enemy");
      } else {
        boardCell.classList.add("board-cell");
      }
      Object.assign(boardCell.dataset, { x, y });
      boardRow.append(boardCell);
      boardCell.dataset.flag = "on";
    }
    field.append(boardRow);
  }
}

// Конец: построение сетки 10х10 для поля игрока и противника

const cellsFriendly = document.querySelectorAll(".board-cell");
const cellsEnemy = document.querySelectorAll(".board-cell__enemy");

// Начало: логика расположения корабля

wagon.onmousedown = function (event) {
  getDispositioOfShips(event, wagon);
};

casers.forEach((caser) => {
  caser.onmousedown = function (event) {
    getDispositioOfShips(event, caser);
  };
});

destroyers.forEach((destroyer) => {
  destroyer.onmousedown = function (event) {
    getDispositioOfShips(event, destroyer);
  };
});

boats.forEach((boat) => {
  boat.onmousedown = function (event) {
    getDispositioOfShips(event, boat);
  };
});

function getDispositioOfShips(event, ship) {
  ship.style.position = "absolute";
  ship.style.zIndex = 1000;

  document.body.append(ship);

  moveAt(event.pageX, event.pageY);

  function moveAt(pageX, pageY) {
    ship.style.left = pageX - ship.offsetWidth / 2 + "px";
    ship.style.top =
      pageY - ship.offsetHeight / (ship.childElementCount * 2) + "px";
  }

  let currentDroppable = null;

  onMouseMove(event);

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);

    ship.hidden = true;

    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

    ship.hidden = false;

    ship.classList.add("active");

    if (!elemBelow) return;

    let droppableBelow = elemBelow.closest(".board-cell");

    if (currentDroppable != droppableBelow) {
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        getCurrentXY(currentDroppable, ship, onMouseMove);
      }
    }
  }

  document.addEventListener("mousemove", onMouseMove);

  ship.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    ship.onmouseup = null;
  };

  ship.ondragstart = function () {
    return false;
  };

  if (ship.childElementCount !== 1) {
    document.addEventListener("keydown", function (event) {
      getTurnShip(event, ship);
    });
  }
}

// Конец: логика расположения корабля

// Начало: Поворот корабля

function getTurnShip(event, ship) {
  for (let decks in shipNames) {
    if (ship.childElementCount == decks) {
      if (event.keyCode == "32" && ship.classList.contains("active")) {
        if (ship.classList.contains(`ship__${shipNames[decks]}`)) {
          ship.classList.remove(`ship__${shipNames[decks]}`);
          ship.classList.add(`${shipNames[decks]}--rotate`);
        } else {
          ship.classList.add(`ship__${shipNames[decks]}`);
          ship.classList.remove(`${shipNames[decks]}--rotate`);
        }
        event.stopPropagation();
      }
    }
  }
}

// Конец: Поворот корабля

// Начало: Расположение корабля на доске

function getCurrentXY(currentDroppable, ship, onMouseMove) {
  ship.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    ship.classList.remove("active");
    playerBoard.style.position = "relative";
    playerBoard.append(ship);

    getPlacement(currentDroppable, ship, battlefieldPlayer, boardFriendly);
  };
}

// Конец: Расположение корабля на доске

// Начало: Заполнение матрицы координатами

function getPlacement(currentDroppable, ship, battlefield, board) {
  const [cx, cy] = [currentDroppable.dataset.x, currentDroppable.dataset.y];
  const shipSize = ship.childElementCount;

  let lastShipDeckCx, lastShipDeckCy;

  if (ship.classList.contains(`${shipNames[shipSize]}--rotate`)) {
    [lastShipDeckCx, lastShipDeckCy] = [
      parseInt(cx) + shipSize - 1,
      parseInt(cy),
    ];
  } else if (ship.classList.contains(`ship__${shipNames[shipSize]}`)) {
    [lastShipDeckCx, lastShipDeckCy] = [
      parseInt(cx),
      parseInt(cy) + shipSize - 1,
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

  checkShipInstallation(cx, cy, ship, shipSize, board);

  if (ship.classList.contains(`${shipNames[shipSize]}--rotate`)) {
    getHorisontalShip(cx, cy, shipSize, battlefield, board);
  } else if (ship.classList.contains(`ship__${shipNames[shipSize]}`)) {
    getVerticalShip(cx, cy, shipSize, battlefield, board);
  }

  return battlefield;
}

function checkShipInstallation(cx, cy, ship, shipSize, board) {
  if (
    (board.length - cx < shipSize &&
      ship.classList.contains(`${shipNames[shipSize]}--rotate`)) ||
    (board.length - cy < shipSize &&
      ship.classList.contains(`ship__${shipNames[shipSize]}`))
  ) {
    document.querySelector(".ship-selection").append(ship);

    return;
  }
}

function getHorisontalShip(cx, cy, shipSize, battlefield, board) {
  for (let y = parseInt(cy) - 1; y < parseInt(cy) + 2; y++) {
    for (let x = parseInt(cx) - 1; x < parseInt(cx) + shipSize + 1; x++) {
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
      for (let k = 1; k <= shipSize; k++) {
        if (cy == y && cx == x) {
          board[y][x + k - 1] = shipSize;
        }
      }
    }
  }
}

function getVerticalShip(cx, cy, shipSize, battlefield, board) {
  for (let y = parseInt(cy) - 1; y < parseInt(cy) + shipSize + 1; y++) {
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
      for (let k = 1; k <= shipSize; k++) {
        if (cy == y && cx == x) {
          board[y + k - 1][x] = shipSize;
        }
      }
    }
  }
}

// Конец: Заполнение матрицы координатами

console.log(boardFriendly);

// Начало игры

startButton.addEventListener("click", function () {
  if (
    (shipSelectionUp.childElementCount == 0 &&
      shipSelectionDown.childElementCount == 0) ||
    (shipSelectionUp.style.zIndex == -10 &&
      shipSelectionDown.style.zIndex == -10)
  ) {
    playerBoard.style.zIndex = -10;
    enemyBoard.style.zIndex = 0;
    alert("Игра началась!");

    renderingShips(boardFriendly, cellsFriendly);

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

independentButton.addEventListener("click", function (event) {
  getFullBattlefieldMatrix(battlefieldPlayer);
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < boardFriendly.length; j++) {
      cellsFriendly.forEach((cell) => (cell.style.backgroundColor = ""));
      boardFriendly[i][j] = 0;
    }
  }
  ships.forEach((ship) => (ship.style.display = ""));
  shipSelectionUp.style.zIndex = 0;
  shipSelectionDown.style.zIndex = 0;

  location.reload();
  event.preventDefault();
});

randomButton.addEventListener("click", function (event) {
  getFullBattlefieldMatrix(battlefieldPlayer);
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < boardFriendly.length; j++) {
      cellsFriendly.forEach((cell) => (cell.style.backgroundColor = ""));
      boardFriendly[i][j] = 0;
    }
    event.preventDefault();
  }

  for (let i = 0; i < shipsOnBoardArray.length; i++) {
    getRandomPlacement(shipsOnBoardArray[i], battlefieldPlayer, boardFriendly);
  }

  renderingShips(boardFriendly, cellsFriendly);

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

function renderingShips(board, cells) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      cells.forEach((cell) => {
        if (board[i][j] !== 0) {
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
}

// Начало: заполнение матрицы постановки кораблей противника

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

for (let i = 0; i < shipsOnBoardArray.length; i++) {
  enemyBoard.style.zIndex = -10;
  getRandomPlacement(shipsOnBoardArray[i], battlefieldEnemy, enemyBoardMatrix);
}

function getRandomPlacement(shipSize, battlefield, boardMatrix) {
  const [cx, cy] = [getRandomInt(0, 10), getRandomInt(0, 10)];

  const direction = getRandomInt(0, 2);

  if (direction == 1) {
    [lastShipDeckCx, lastShipDeckCy] = [cx + shipSize - 1, cy];
  } else if (direction == 0) {
    [lastShipDeckCx, lastShipDeckCy] = [cx, cy + shipSize - 1];
  }

  for (let item in battlefield) {
    for (let key in battlefield[item]) {
      if (
        (cx == key && cy == battlefield[item][key]) ||
        (lastShipDeckCx == key && lastShipDeckCy == battlefield[item][key])
      ) {
        return getRandomPlacement(shipSize, battlefield, boardMatrix);
      }
    }
  }

  if (
    (boardMatrix.length - cx < shipSize && direction == 1) ||
    (boardMatrix.length - cy < shipSize && direction == 0)
  ) {
    return getRandomPlacement(shipSize, battlefield, boardMatrix);
  }

  if (direction == 1) {
    getHorisontalShip(cx, cy, shipSize, battlefield, boardMatrix);
  } else {
    getVerticalShip(cx, cy, shipSize, battlefield, boardMatrix);
  }

  return boardMatrix;
}

// Конец: заполнение матрицы постановки кораблей противника

// Начало: Уничтожение кораблей противника

let countObj = { 1: 0, 2: 0, 3: 0, 4: 0 };

enemyBoard.addEventListener("click", function (event) {
  const [currentY, currentX] = [event.target.dataset.y, event.target.dataset.x];
  const currentCellVar = enemyBoardMatrix[currentY][currentX];

  if (currentCellVar !== 0) {
    for (let key in countObj) {
      if (key == currentCellVar) {
        countObj[key]++;
      }
      if (countObj[key] > key && key == currentCellVar) {
        countObj[key] = 1;
      }
    }
  }

  if (currentCellVar !== 0) {
    for (let y = parseInt(currentY) - 1; y < parseInt(currentY) + 2; y++) {
      for (let x = parseInt(currentX) - 1; x < parseInt(currentX) + 2; x++) {
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
            (x !== parseInt(currentX) && y == parseInt(currentY)) ||
            (x == parseInt(event.target.dataset.x) && y !== parseInt(currentX))
          ) {
            event.target.style.backgroundColor = "red";
            event.target.style.border = "1px solid gray";
            event.target.style.zIndex = -10;
          }
        }
      }
    }
  } else if (currentCellVar == 0) {
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
          setTimeout(() => {
            cell.style.backgroundColor = "yellow";
            cell.style.zIndex = -10;
          }, 100);
        }
      });
    }
  }
});

// Конец: Уничтожение кораблей противника

// Начало: стрельба ИИ

enemyBoard.addEventListener("click", checkShot);

let verifiedCoodinateCell, prevCoordinateCell;
let secondShotCoordinateX, secondShotCoordinateY;

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
  if (!hitShot) {
    [cx, cy] = [getRandomInt(0, 10), getRandomInt(0, 10)];
  } else {
    [cx, cy] = [prevCoordinateCell[1], prevCoordinateCell[0]];
  }

  if (secondShot) {
    [cx, cy] = [secondShotCoordinateX, secondShotCoordinateY];
  }

  let recurringCell = false;

  // console.log([cy, cx], prevCoordinateCell, verifiedCoodinateCell);

  cellsArr.forEach((cell) => {
    if (
      cell.dataset.y == cy &&
      cell.dataset.x == cx &&
      cell.dataset.flag == "off" &&
      hitShot !== true &&
      secondShot !== true
    ) {
      if (!recurringCell) {
        shotCell(board, cellsArr);
        recurringCell = true;
      }
    }

    if (cell.dataset.y == cy && cell.dataset.x == cx && board[cy][cx] == 0) {
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

        if (secondShot !== true) {
          checkAroundCell(cy, cx, cellsFriendly);
          checkShipDeck(
            verifiedCoodinateCell,
            prevCoordinateCell,
            cellsFriendly,
            boardFriendly
          );
        } else if (board[cy][cx] == 3 && secondShot == true) {
          secondShot = false;
          shotCell(boardFriendly, cellsFriendly);
        } else if (board[cy][cx] == 4 && secondShot == true) {
          secondShot = false;
          shotCell(boardFriendly, cellsFriendly);
          if (cx > verifiedCoodinateCell[1] || cx > prevCoordinateCell[1]) {
            if (cell.dataset.x == parseInt(cx) + 1 && cell.dataset.y == cy) {
              cell.style.backgroundColor = "red";
              enemyBoard.style.zIndex = 0;
              cell.dataset.flag = "off";
              cell.dataset.isWounded = "yes";
            }
          } else if (
            cx < verifiedCoodinateCell[1] ||
            cx < prevCoordinateCell[1]
          ) {
            if (cell.dataset.x == cx - 1 && cell.dataset.y == cy) {
              cell.style.backgroundColor = "red";
              enemyBoard.style.zIndex = 0;
              cell.dataset.flag = "off";
              cell.dataset.isWounded = "yes";
            }
          } else {
            secondShot = false;
            shotCell(boardFriendly, cellsFriendly);
          }
        }
      }, 500);
    }
  });
}

function checkAroundCell(cy, cx, cellsArr) {
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

  if (filterArr.length !== 0) {
    prevCoordinateCell = [cy, cx];
    verifiedCoodinateCell = [
      filterArr[randomCell][0],
      filterArr[randomCell][1],
    ];
  }
}

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

  enemyBoard.style.zIndex = -10;

  cellsFriendly.forEach((cell) => {
    if (
      cell.dataset.x == currentX &&
      cell.dataset.y == currentY &&
      boardFriendly[currentY][currentX] == 0 &&
      boardFriendly[prevY][prevX] !== 1
    ) {
      hitShot = true;
      setTimeout(() => {
        cell.style.backgroundColor = "yellow";
        enemyBoard.style.zIndex = 0;
        cell.dataset.flag = "off";
      }, 500);
    }

    // Для однопалубного
    if (
      cell.dataset.x == prevX &&
      cell.dataset.y == prevY &&
      boardFriendly[prevY][prevX] == 1
    ) {
      hitShot = false;
      setTimeout(() => {
        enemyBoard.style.zIndex = 0;
        cell.dataset.flag = "off";
        showFreeCellsBoat(prevY, prevX, cellsFriendly);
        shotCell(boardFriendly, cellsFriendly);
      }, 500);
    }

    // Для двухпалубного

    if (
      cell.dataset.x == currentX &&
      cell.dataset.y == currentY &&
      boardFriendly[currentY][currentX] == 2
    ) {
      hitShot = false;
      setTimeout(() => {
        cell.style.backgroundColor = "red";
        enemyBoard.style.zIndex = 0;
        cell.dataset.flag = "off";
        cell.dataset.isWounded = "yes";
        if (currentY == prevY) {
          showFreeCellsHorisontalShip(
            currentY,
            currentX,
            prevY,
            prevX,
            cellsFriendly
          );
        } else {
          showFreeCellsVerticalShip(
            currentY,
            currentX,
            prevY,
            prevX,
            cellsFriendly
          );
        }

        shotCell(boardFriendly, cellsFriendly);
      }, 1000);
    }

    // Для трехпалубного

    if (
      cell.dataset.x == currentX &&
      cell.dataset.y == currentY &&
      boardFriendly[currentY][currentX] == 3
    ) {
      hitShot = false;

      setTimeout(() => {
        cell.style.backgroundColor = "red";
        enemyBoard.style.zIndex = 0;
        cell.dataset.flag = "off";
        cell.dataset.isWounded = "yes";
      }, 500);
      if (currentY == prevY && boardFriendly[currentY][currentX] == 3) {
        checkHorisontalCellsForBattleCaser(
          currentX,
          currentY,
          prevX,
          prevY,
          cellsFriendly,
          boardFriendly
        );
      } else if (currentX == prevX && boardFriendly[currentY][currentX] == 3) {
        checkVerticalCellsForBattleCaser(
          currentX,
          currentY,
          prevX,
          prevY,
          cellsFriendly,
          boardFriendly
        );
      }
    }
    // Для  четырехпалубного

    if (
      cell.dataset.x == currentX &&
      cell.dataset.y == currentY &&
      boardFriendly[currentY][currentX] == 4
    ) {
      hitShot = false;

      setTimeout(() => {
        cell.style.backgroundColor = "red";
        enemyBoard.style.zIndex = 0;
        cell.dataset.flag = "off";
        cell.dataset.isWounded = "yes";
      }, 500);
      if (currentY == prevY && boardFriendly[currentY][currentX] == 4) {
        checkHorisontalCellsForWagon(
          currentX,
          currentY,
          prevX,
          prevY,
          cellsFriendly,
          boardFriendly
        );
      } else if (currentX == prevX && boardFriendly[currentY][currentX] == 4) {
        console.log("poka nichego");
      }
    }
  });
}

function showFreeCellsBoat(prevY, prevX, cells) {
  for (let y = parseInt(prevY) - 1; y < parseInt(prevY) + 2; y++) {
    for (let x = parseInt(prevX) - 1; x < parseInt(prevX) + 2; x++) {
      if (x >= 0 && y >= 0 && x < 10 && y < 10) {
        cells.forEach((cell) => {
          if (cell.dataset.x == x && cell.dataset.y == y) {
            cell.style.backgroundColor = "yellow";
            cell.dataset.flag = "off";
          } else if (prevY == cell.dataset.y && prevX == cell.dataset.x) {
            cell.style.backgroundColor = "red";
            cell.dataset.flag = "off";
          }
        });
      }
    }
  }
}

function showFreeCellsHorisontalShip(currentY, currentX, prevY, prevX, cells) {
  const shipDecks = boardFriendly[currentY][currentX];

  if (currentX < prevX) {
    for (let y = parseInt(currentY) - 1; y < parseInt(currentY) + 2; y++) {
      for (
        let x = parseInt(currentX) - 1;
        x < parseInt(currentX) + shipDecks + 1;
        x++
      ) {
        if (x >= 0 && y >= 0 && x < 10 && y < 10) {
          cells.forEach((cell) => {
            if (
              cell.dataset.x == x &&
              cell.dataset.y == y &&
              cell.dataset.isWounded !== "yes"
            ) {
              cell.style.backgroundColor = "yellow";
              cell.dataset.flag = "off";
            } else if (cell.dataset.isWounded == "yes") {
              cell.style.backgroundColor = "red";
              cell.dataset.flag = "off";
            }
          });
        }
      }
    }
  } else {
    for (let y = parseInt(prevY) - 1; y < parseInt(prevY) + 2; y++) {
      for (
        let x = parseInt(prevX) - 1;
        x < parseInt(prevX) + shipDecks + 1;
        x++
      ) {
        if (x >= 0 && y >= 0 && x < 10 && y < 10) {
          cells.forEach((cell) => {
            if (
              cell.dataset.x == x &&
              cell.dataset.y == y &&
              cell.dataset.isWounded !== "yes"
            ) {
              cell.style.backgroundColor = "yellow";
              cell.dataset.flag = "off";
            } else if (cell.dataset.isWounded == "yes") {
              cell.style.backgroundColor = "red";
              cell.dataset.flag = "off";
            }
          });
        }
      }
    }
  }
}

function showFreeCellsVerticalShip(currentY, currentX, prevY, prevX, cells) {
  const shipDecks = boardFriendly[currentY][currentX];

  if (currentY < prevY) {
    for (
      let y = parseInt(currentY) - 1;
      y < parseInt(currentY) + shipDecks + 1;
      y++
    ) {
      for (let x = parseInt(currentX) - 1; x < parseInt(currentX) + 2; x++) {
        if (x >= 0 && y >= 0 && x < 10 && y < 10) {
          cells.forEach((cell) => {
            if (cell.dataset.x == x && cell.dataset.y == y) {
              cell.style.backgroundColor = "yellow";
              cell.dataset.flag = "off";
            } else if (
              (currentY == cell.dataset.y && currentX == cell.dataset.x) ||
              (prevY == cell.dataset.y && prevX == cell.dataset.x)
            ) {
              cell.style.backgroundColor = "red";
              cell.dataset.flag = "off";
            }
          });
        }
      }
    }
  } else {
    for (
      let y = parseInt(prevY) - 1;
      y < parseInt(prevY) + shipDecks + 1;
      y++
    ) {
      for (let x = parseInt(prevX) - 1; x < parseInt(prevX) + 2; x++) {
        if (x >= 0 && y >= 0 && x < 10 && y < 10) {
          cells.forEach((cell) => {
            if (cell.dataset.x == x && cell.dataset.y == y) {
              cell.style.backgroundColor = "yellow";
              cell.dataset.flag = "off";
            } else if (
              (currentY == cell.dataset.y && currentX == cell.dataset.x) ||
              (prevY == cell.dataset.y && prevX == cell.dataset.x)
            ) {
              cell.style.backgroundColor = "red";
              cell.dataset.flag = "off";
            }
          });
        }
      }
    }
  }
}

function checkHorisontalCellsForBattleCaser(
  currentX,
  currentY,
  prevX,
  prevY,
  cellsFriendly,
  boardFriendly
) {
  let checkedCells = [];
  let resultCheckedCells = [];

  if (prevX > currentX) {
    if (prevX - 2 < 0) {
      checkedCells = [[currentY, prevX + 1]];
    } else if (prevX + 1 > 9) {
      checkedCells = [[currentY, prevX - 2]];
    } else {
      checkedCells = [
        [currentY, prevX + 1],
        [currentY, prevX - 2],
      ];
    }
  } else {
    if (currentX - 2 < 0) {
      checkedCells = [[currentY, currentX + 1]];
    } else if (currentX + 1 > 9) {
      checkedCells = [[currentY, currentX - 2]];
    } else {
      checkedCells = [
        [currentY, currentX - 2],
        [currentY, currentX + 1],
      ];
    }
  }

  cellsFriendly.forEach((cell) => {
    for (let i = 0; i < checkedCells.length; i++) {
      if (
        cell.dataset.x == checkedCells[i][1] &&
        cell.dataset.y == checkedCells[i][0] &&
        cell.dataset.flag == "on"
      ) {
        resultCheckedCells.push(checkedCells[i]);
      }
    }
  });

  randomCell = Math.floor(Math.random() * resultCheckedCells.length);

  secondShotCoordinateX = resultCheckedCells[randomCell][1];
  secondShotCoordinateY = resultCheckedCells[randomCell][0];

  if (boardFriendly[secondShotCoordinateY][secondShotCoordinateX] !== 0) {
    enemyBoard.style.zIndex = -10;

    if (
      boardFriendly[currentY][currentX] == 3 &&
      boardFriendly[prevY][prevX] == 3
    ) {
      hitShot = false;
      secondShot = false;

      setTimeout(() => {
        enemyBoard.style.zIndex = 0;
        cellsFriendly.forEach((cell) => {
          if (
            cell.dataset.x == secondShotCoordinateX &&
            cell.dataset.y == secondShotCoordinateY
          ) {
            cell.style.backgroundColor = "red";

            cell.dataset.flag = "off";
          }
        });
        // showFreeCellsHorisontalShip(
        //   currentY,
        //   currentX,
        //   prevY,
        //   prevX,
        //   cellsFriendly
        // );
        shotCell(boardFriendly, cellsFriendly);
      }, 1500);
    }
  } else {
    console.log("ne popal");
    secondShot = true;

    setTimeout(() => {
      enemyBoard.style.zIndex = 0;

      cellsFriendly.forEach((cell) => {
        if (
          cell.dataset.x == secondShotCoordinateX &&
          cell.dataset.y == secondShotCoordinateY
        ) {
          cell.style.backgroundColor = "yellow";

          cell.dataset.flag = "off";
        }
      });

      if (boardFriendly[checkedCells[0][0]][checkedCells[0][1]] == 0) {
        secondShotCoordinateX = checkedCells[1][1];
        secondShotCoordinateY = checkedCells[1][0];
      } else {
        secondShotCoordinateX = checkedCells[0][1];
        secondShotCoordinateY = checkedCells[0][0];
      }
    }, 1000);
  }
}

function checkVerticalCellsForBattleCaser(
  currentX,
  currentY,
  prevX,
  prevY,
  cellsFriendly,
  boardFriendly
) {
  let checkedCells = [];
  let resultCheckedCells = [];

  if (prevY > currentY) {
    if (prevY - 2 < 0) {
      checkedCells = [[prevY + 1, currentX]];
    } else if (prevX + 1 > 9) {
      checkedCells = [[prevY - 2, currentX]];
    } else {
      checkedCells = [
        [prevY + 1, currentX],
        [prevY - 2, currentX],
      ];
    }
  } else {
    if (currentY - 2 < 0) {
      checkedCells = [[currentY + 1, currentX]];
    } else if (currentY + 1 > 9) {
      checkedCells = [[currentY - 2, currentX]];
    } else {
      checkedCells = [
        [currentY - 2, currentX],
        [currentY + 1, currentX],
      ];
    }
  }

  cellsFriendly.forEach((cell) => {
    for (let i = 0; i < checkedCells.length; i++) {
      if (
        cell.dataset.x == checkedCells[i][1] &&
        cell.dataset.y == checkedCells[i][0] &&
        cell.dataset.flag == "on"
      ) {
        resultCheckedCells.push(checkedCells[i]);
      }
    }
  });

  randomCell = Math.floor(Math.random() * resultCheckedCells.length);

  secondShotCoordinateX = resultCheckedCells[randomCell][1];
  secondShotCoordinateY = resultCheckedCells[randomCell][0];

  if (boardFriendly[secondShotCoordinateY][secondShotCoordinateX] !== 0) {
    enemyBoard.style.zIndex = -10;

    if (
      boardFriendly[currentY][currentX] == 3 &&
      boardFriendly[prevY][prevX] == 3
    ) {
      hitShot = false;
      secondShot = false;

      setTimeout(() => {
        enemyBoard.style.zIndex = 0;
        cellsFriendly.forEach((cell) => {
          if (
            cell.dataset.x == secondShotCoordinateX &&
            cell.dataset.y == secondShotCoordinateY
          ) {
            cell.style.backgroundColor = "red";

            cell.dataset.flag = "off";
          }
        });
        // showFreeCellsVerticalShip(
        //   currentY,
        //   currentX,
        //   prevY,
        //   prevX,
        //   cellsFriendly
        // );
        shotCell(boardFriendly, cellsFriendly);
      }, 1500);
    }
  } else {
    secondShot = true;

    setTimeout(() => {
      enemyBoard.style.zIndex = 0;

      cellsFriendly.forEach((cell) => {
        if (
          cell.dataset.x == secondShotCoordinateX &&
          cell.dataset.y == secondShotCoordinateY
        ) {
          cell.style.backgroundColor = "yellow";

          cell.dataset.flag = "off";
        }
      });

      if (boardFriendly[checkedCells[0][0]][checkedCells[0][1]] == 0) {
        secondShotCoordinateX = checkedCells[1][1];
        secondShotCoordinateY = checkedCells[1][0];
      } else {
        secondShotCoordinateX = checkedCells[0][1];
        secondShotCoordinateY = checkedCells[0][0];
      }
    }, 1000);
  }
}

function checkHorisontalCellsForWagon(
  currentX,
  currentY,
  prevX,
  prevY,
  cellsFriendly,
  boardFriendly
) {
  let adjacentCells = [];
  let resultAdjacentCells = [];

  if (prevX > currentX) {
    if (prevX + 1 > 9) {
      adjacentCells = [currentY, currentX - 1];
    } else if (currentX - 1 < 0) {
      adjacentCells = [currentY, prevX + 1];
    } else {
      adjacentCells = [
        [currentY, currentX - 1],
        [currentY, prevX + 1],
      ];
    }
  } else {
    if (currentX + 1 > 9) {
      adjacentCells = [currentY, prevX - 1];
    } else if (prevX - 1 < 0) {
      adjacentCells = [currentY, currentX + 1];
    } else {
      adjacentCells = [
        [currentY, currentX + 1],
        [currentY, prevX - 1],
      ];
    }
  }

  cellsFriendly.forEach((cell) => {
    for (let i = 0; i < adjacentCells.length; i++) {
      if (
        cell.dataset.x == adjacentCells[i][1] &&
        cell.dataset.y == adjacentCells[i][0] &&
        cell.dataset.flag == "on"
      ) {
        resultAdjacentCells.push(adjacentCells[i]);
      }
    }
  });

  console.log("start", [currentY, currentX]);
  console.log("prev", [prevY, prevX]);

  if (resultAdjacentCells.length == 1) {
    hitShot = false;
    if (
      resultAdjacentCells[0][1] > currentX ||
      resultAdjacentCells[0][1] > prevX
    ) {
      cellsFriendly.forEach((cell) => {
        if (
          cell.dataset.x == resultAdjacentCells[0][1] + 1 &&
          cell.dataset.y == resultAdjacentCells[0][0]
        ) {
          setTimeout(() => {
            cell.style.backgroundColor = "red";
            enemyBoard.style.zIndex = 0;
            cell.dataset.flag = "off";
            cell.dataset.isWounded = "yes";
          }, 1500);
        } else if (
          cell.dataset.x == resultAdjacentCells[0][1] &&
          cell.dataset.y == resultAdjacentCells[0][0]
        ) {
          setTimeout(() => {
            cell.style.backgroundColor = "red";
            enemyBoard.style.zIndex = 0;
            cell.dataset.flag = "off";
            cell.dataset.isWounded = "yes";
          }, 1000);
        }
      });
    } else if (
      resultAdjacentCells[0][1] < currentX ||
      resultAdjacentCells[0][1] < prevX
    ) {
      cellsFriendly.forEach((cell) => {
        if (
          cell.dataset.x == resultAdjacentCells[0][1] - 1 &&
          cell.dataset.y == resultAdjacentCells[0][0]
        ) {
          setTimeout(() => {
            cell.style.backgroundColor = "red";
            enemyBoard.style.zIndex = 0;
            cell.dataset.flag = "off";
            cell.dataset.isWounded = "yes";
          }, 1500);
        } else if (
          cell.dataset.x == resultAdjacentCells[0][1] &&
          cell.dataset.y == resultAdjacentCells[0][0]
        ) {
          setTimeout(() => {
            cell.style.backgroundColor = "red";
            enemyBoard.style.zIndex = 0;
            cell.dataset.flag = "off";
            cell.dataset.isWounded = "yes";
          }, 1000);
        }
      });
      setTimeout(() => {
        shotCell(boardFriendly, cellsFriendly);
      }, 2000);
    }
  }

  console.log(adjacentCells);
  console.log(resultAdjacentCells);

  randomCell = Math.floor(Math.random() * resultAdjacentCells.length);

  secondShotCoordinateX = resultAdjacentCells[randomCell][1];
  secondShotCoordinateY = resultAdjacentCells[randomCell][0];

  console.log([secondShotCoordinateY, secondShotCoordinateX]);

  if (
    boardFriendly[secondShotCoordinateY][secondShotCoordinateX] !== 0 &&
    resultAdjacentCells.length !== 1
  ) {
    enemyBoard.style.zIndex = -10;

    console.log("2 svobodnie");

    cellsFriendly.forEach((cell) => {
      if (
        cell.dataset.x == secondShotCoordinateX &&
        cell.dataset.y == secondShotCoordinateY
      ) {
        setTimeout(() => {
          cell.style.backgroundColor = "red";
          enemyBoard.style.zIndex = 0;
          cell.dataset.flag = "off";
          cell.dataset.isWounded = "yes";
        }, 1000);
      }

      if (
        boardFriendly[secondShotCoordinateY][secondShotCoordinateX + 1] !== 0 &&
        cell.dataset.x == secondShotCoordinateX + 1 &&
        cell.dataset.y == secondShotCoordinateY
      ) {
        hitShot = false;
        setTimeout(() => {
          cell.style.backgroundColor = "red";
          enemyBoard.style.zIndex = 0;
          cell.dataset.flag = "off";
          cell.dataset.isWounded = "yes";
          shotCell(boardFriendly, cellsFriendly);
        }, 1500);
      } else if (
        boardFriendly[secondShotCoordinateY][secondShotCoordinateX + 1] == 0 &&
        cell.dataset.x == secondShotCoordinateX + 1 &&
        cell.dataset.y == secondShotCoordinateY
      ) {
        setTimeout(() => {
          cell.style.backgroundColor = "yellow";
          enemyBoard.style.zIndex = 0;
          cell.dataset.flag = "off";
          cell.dataset.isWounded = "yes";
        }, 1500);
      }

      if (
        boardFriendly[resultAdjacentCells[0][0]][resultAdjacentCells[0][1]] == 0
      ) {
        secondShotCoordinateX = resultAdjacentCells[1][1];
        secondShotCoordinateY = resultAdjacentCells[1][0];
        secondShot = true;
      } else {
        secondShotCoordinateX = resultAdjacentCells[0][1];
        secondShotCoordinateY = resultAdjacentCells[0][0];
        secondShot = true;
      }

      // В следубщем ходе покрасить и вызвать функцию с рандомным сх су
    });

    // то берем из  adjacentCells другое число и красим его

    // if (
    //   boardFriendly[currentY][currentX] == 4 &&
    //   boardFriendly[prevY][prevX] == 4
    // ) {
    //   hitShot = false;
    //   secondShot = false;

    //   setTimeout(() => {
    //     enemyBoard.style.zIndex = 0;
    //     cellsFriendly.forEach((cell) => {
    //       if (
    //         cell.dataset.x == secondShotCoordinateX &&
    //         cell.dataset.y == secondShotCoordinateY
    //       ) {
    //         cell.style.backgroundColor = "red";

    //         cell.dataset.flag = "off";
    //       }
    //     });
    //     // showFreeCellsHorisontalShip(
    //     //   currentY,
    //     //   currentX,
    //     //   prevY,
    //     //   prevX,
    //     //   cellsFriendly
    //     // );
    //     shotCell(boardFriendly, cellsFriendly);
    //   }, 1500);
    // }
  } else {
    secondShot = true;

    setTimeout(() => {
      enemyBoard.style.zIndex = 0;

      if (
        boardFriendly[resultAdjacentCells[0][0]][resultAdjacentCells[0][1]] == 0
      ) {
        secondShotCoordinateX = resultAdjacentCells[1][1];
        secondShotCoordinateY = resultAdjacentCells[1][0];
      } else {
        secondShotCoordinateX = resultAdjacentCells[0][1];
        secondShotCoordinateY = resultAdjacentCells[0][0];
      }
    }, 1000);
  }
}

// Конец: стрельба ИИ
