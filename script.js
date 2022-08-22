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
const resetButton = document.querySelector(".reset-button");

const shipNames = { 1: "boat", 2: "destroyer", 3: "caser", 4: "wagon" };
const shipsOnBoardArray = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

// Начало: Построение матрицы для игры
let firstShipCoordinateArrayHorisonal = [];
let firstShipCoordinateArrayVertical = [];
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
    firstShipCoordinateArrayHorisonal.push([cy, cx]);
    getHorisontalShip(cx, cy, shipSize, battlefield, board);
  } else if (ship.classList.contains(`ship__${shipNames[shipSize]}`)) {
    firstShipCoordinateArrayVertical.push([cy, cx]);
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

    alert("Сделай свой ход!");
    independentButton.style.zIndex = -10;
    randomButton.style.zIndex = -10;
    startButton.style.zIndex = -10;
  } else {
    alert("Не все корабли выставлены на поле!");
  }
});

independentButton.addEventListener("click", function (event) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < boardFriendly.length; j++) {
      cellsFriendly.forEach((cell) => (cell.style.backgroundColor = ""));
      boardFriendly[i][j] = 0;
      battlefieldPlayer[i][j] = "a";
    }
  }

  firstShipCoordinateArrayHorisonal = [];
  firstShipCoordinateArrayVertical = [];

  ships.forEach((ship) => (ship.style.display = ""));
  shipSelectionUp.style.zIndex = 0;
  shipSelectionDown.style.zIndex = 0;

  location.reload();
  event.preventDefault();
});

randomButton.addEventListener("click", function (event) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < boardFriendly.length; j++) {
      cellsFriendly.forEach((cell) => (cell.style.backgroundColor = ""));
      boardFriendly[i][j] = 0;
      battlefieldPlayer[i][j] = "a";
    }
    event.preventDefault();
  }

  firstShipCoordinateArrayHorisonal = [];
  firstShipCoordinateArrayVertical = [];

  for (let i = 0; i < shipsOnBoardArray.length; i++) {
    getRandomPlacement(shipsOnBoardArray[i], battlefieldPlayer, boardFriendly);
  }

  renderingShips(boardFriendly, cellsFriendly);
});

resetButton.addEventListener("click", function (event) {
  location.reload();
  event.preventDefault();
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
    firstShipCoordinateArrayHorisonal.push([cy, cx]);
    getHorisontalShip(cx, cy, shipSize, battlefield, boardMatrix);
  } else {
    firstShipCoordinateArrayVertical.push([cy, cx]);
    getVerticalShip(cx, cy, shipSize, battlefield, boardMatrix);
  }

  return boardMatrix;
}
// Конец: заполнение матрицы постановки кораблей противника

// Начало: Уничтожение кораблей противника

let countObj = { 1: 0, 2: 0, 3: 0, 4: 0 };
let counterWoundedDecksEnemy = 0;

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
    counterWoundedDecksEnemy++;
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
            event.target.dataset.isWounded = "yes";
          }
        }
      }
    }

    if (counterWoundedDecksEnemy == 20) {
      enemyBoard.style.zIndex = -10;
      setTimeout(() => {
        alert("Ты победил!");
      });
    }
  } else if (currentCellVar == 0) {
    event.target.style.background =
      "url('./img/circle-black-shape-svgrepo-com.svg') no-repeat center";
    event.target.style.border = "1px solid gray";
    event.target.style.zIndex = -10;
    event.target.dataset.flag = "off";
  }

  for (let key in countObj) {
    if (countObj[key] == currentCellVar && key == currentCellVar) {
      cellsEnemy.forEach((cell) => {
        if (cell.dataset.flag == "off") {
          setTimeout(() => {
            cell.style.background =
              "url('./img/circle-black-shape-svgrepo-com.svg') no-repeat center";
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

let woundedY, woundedX;
let randomAroundCellY, randomAroundCellX;
let thirdWoundedDeckArray = [];
let fourthWoundedDeckArray = [];

let shotFlag = false;
let thirdWoundedDeckFlag = false;
let fourthWoundedDeckFlag = false;

let counterWoundedDecksPlayer = 0;

function checkShot(event) {
  currentX = event.target.dataset.x;
  currentY = event.target.dataset.y;
  if (
    enemyBoardMatrix[currentY][currentX] == 0 &&
    !shotFlag &&
    !thirdWoundedDeckFlag &&
    !fourthWoundedDeckFlag
  ) {
    getRandomShot(boardFriendly, cellsFriendly);
  } else if (shotFlag && !thirdWoundedDeckFlag && !fourthWoundedDeckFlag) {
    checkAroundWoundedCell(woundedX, woundedY, cellsFriendly, boardFriendly);
  } else if (thirdWoundedDeckFlag && !fourthWoundedDeckFlag) {
    getThirdWoundedDeck(
      thirdWoundedDeckArray,
      cellsFriendly,
      boardFriendly,
      woundedY,
      woundedX
    );
  } else if (fourthWoundedDeckFlag) {
    lastShot(fourthWoundedDeckArray, cellsFriendly, boardFriendly);
  }
}

function getRandomCoordinatesForShot() {
  const [cx, cy] = [getRandomInt(0, 10), getRandomInt(0, 10)];
  return [cx, cy];
}

let counterWagon = 0;
let counterCaser = 0;
let counterDestroyer = 0;
let counterBoat = 0;

let woundedDecksArrayHorisontal = [];
let woundedDecksArrayVertical = [];

function getWoundedDeck(cell) {
  cell.style.backgroundColor = "red";
  cell.dataset.isWounded = "yes";
  cell.dataset.flag = "off";
  counterWoundedDecksPlayer++;
  if (counterWoundedDecksPlayer == 20) {
    enemyBoard.style.zIndex = -10;
    setTimeout(() => {
      alert("Ты проиграл!");
      for (let i = 0; i < enemyBoardMatrix.length; i++) {
        for (let j = 0; j < enemyBoardMatrix.length; j++) {
          cellsEnemy.forEach((cell) => {
            if (enemyBoardMatrix[i][j] !== 0) {
              if (
                j == cell.dataset.x &&
                i == cell.dataset.y &&
                cell.dataset.isWounded !== "yes"
              ) {
                cell.style.backgroundColor = "green";
                cell.style.border = "1px solid grey";
              }
            }
          });
        }
      }
    }, 500);
  }

  const shipSize = boardFriendly[cell.dataset.y][cell.dataset.x];

  if (boardFriendly[cell.dataset.y][cell.dataset.x] == 4) {
    counterWagon++;
    isShipWounded(cell);
    if (counterWagon == 4) {
      counterWagon = 0;
      if (woundedDecksArrayHorisontal.length) {
        sunkDeckHorisontal(
          woundedDecksArrayHorisontal,
          cellsFriendly,
          shipSize
        );
      } else if (woundedDecksArrayVertical.length) {
        sunkDeckVertical(woundedDecksArrayVertical, cellsFriendly, shipSize);
      }
    }
  } else if (boardFriendly[cell.dataset.y][cell.dataset.x] == 3) {
    counterCaser++;
    isShipWounded(cell);
    if (counterCaser == 3) {
      counterCaser = 0;
      if (woundedDecksArrayHorisontal.length) {
        sunkDeckHorisontal(
          woundedDecksArrayHorisontal,
          cellsFriendly,
          shipSize
        );
      } else if (woundedDecksArrayVertical.length) {
        sunkDeckVertical(woundedDecksArrayVertical, cellsFriendly, shipSize);
      }
    }
  } else if (boardFriendly[cell.dataset.y][cell.dataset.x] == 2) {
    counterDestroyer++;
    isShipWounded(cell);
    if (counterDestroyer == 2) {
      counterDestroyer = 0;
      if (woundedDecksArrayHorisontal.length) {
        sunkDeckHorisontal(
          woundedDecksArrayHorisontal,
          cellsFriendly,
          shipSize
        );
      } else if (woundedDecksArrayVertical.length) {
        sunkDeckVertical(woundedDecksArrayVertical, cellsFriendly, shipSize);
      }
    }
  } else {
    counterBoat++;
    isShipWounded(cell);
    if (counterBoat == 1) {
      counterBoat = 0;
      if (woundedDecksArrayHorisontal.length) {
        sunkDeckHorisontal(
          woundedDecksArrayHorisontal,
          cellsFriendly,
          shipSize
        );
      } else if (woundedDecksArrayVertical.length) {
        sunkDeckVertical(woundedDecksArrayVertical, cellsFriendly, shipSize);
      }
    }
  }
}

function isShipWounded(cell) {
  for (let i = 0; i < firstShipCoordinateArrayHorisonal.length; i++) {
    if (
      firstShipCoordinateArrayHorisonal[i][0] == cell.dataset.y &&
      firstShipCoordinateArrayHorisonal[i][1] == cell.dataset.x
    ) {
      woundedDecksArrayHorisontal.push([
        parseInt(cell.dataset.y),
        parseInt(cell.dataset.x),
      ]);
    }
  }
  for (let j = 0; j < firstShipCoordinateArrayVertical.length; j++) {
    if (
      firstShipCoordinateArrayVertical[j][0] == cell.dataset.y &&
      firstShipCoordinateArrayVertical[j][1] == cell.dataset.x
    ) {
      woundedDecksArrayVertical.push([
        parseInt(cell.dataset.y),
        parseInt(cell.dataset.x),
      ]);
    }
  }
}

function sunkDeckHorisontal(arrayDecks, cells, shipSize) {
  for (let y = arrayDecks[0][0] - 1; y < arrayDecks[0][0] + 2; y++) {
    for (
      let x = arrayDecks[0][1] - 1;
      x < arrayDecks[0][1] + shipSize + 1;
      x++
    ) {
      if (x >= 0 && y >= 0 && x < 10 && y < 10) {
        cells.forEach((cell) => {
          if (
            cell.dataset.x == x &&
            cell.dataset.y == y &&
            cell.dataset.isWounded !== "yes"
          ) {
            woundedDecksArrayHorisontal = [];
            getMissCell(cell);
          }
        });
      }
    }
  }
}

function sunkDeckVertical(arrayDecks, cells, shipSize) {
  for (let y = arrayDecks[0][0] - 1; y < arrayDecks[0][0] + shipSize + 1; y++) {
    for (let x = arrayDecks[0][1] - 1; x < arrayDecks[0][1] + 2; x++) {
      if (x >= 0 && y >= 0 && x < 10 && y < 10) {
        cells.forEach((cell) => {
          if (
            cell.dataset.x == x &&
            cell.dataset.y == y &&
            cell.dataset.isWounded !== "yes"
          ) {
            woundedDecksArrayVertical = [];
            getMissCell(cell);
          }
        });
      }
    }
  }
}

function getMissCell(cell) {
  setTimeout(() => {
    cell.style.background =
      "url('./img/circle-black-shape-svgrepo-com.svg') no-repeat center";
    cell.dataset.flag = "off";
  }, 500);
}

function getRandomShot(board, cells) {
  const [shotX, shotY] = getRandomCoordinatesForShot();

  cells.forEach((cell) => {
    const conditionCoordinates =
      cell.dataset.x == shotX && cell.dataset.y == shotY;
    if (
      conditionCoordinates &&
      board[shotY][shotX] !== 0 &&
      board[shotY][shotX] !== 1 &&
      cell.dataset.flag == "on"
    ) {
      getWoundedDeck(cell);
      checkAroundWoundedCell(shotX, shotY, cells, board);
    } else if (
      conditionCoordinates &&
      board[shotY][shotX] == 0 &&
      cell.dataset.flag == "on"
    ) {
      getMissCell(cell);
    } else if (
      (conditionCoordinates && cell.dataset.flag == "off") ||
      (conditionCoordinates && cell.dataset.isWounded == "yes")
    ) {
      getRandomShot(board, cells);
    } else if (conditionCoordinates && board[shotY][shotX] == 1) {
      getWoundedDeck(cell);
      getRandomShot(board, cells);
    }
  });
}

function checkAroundWoundedCell(shotX, shotY, cells, board) {
  const allCellsArr = [];
  let filteredCellsArr = [];

  cells.forEach((cell) => {
    if (cell.dataset.x == shotX && cell.dataset.y == shotY) {
      for (let y = shotY - 1; y < shotY + 2; y++) {
        for (let x = shotX - 1; x < shotX + 2; x++) {
          if (x >= 0 && y >= 0 && x < 10 && y < 10) {
            if ((shotX !== x && shotY == y) || (shotX == x && shotY !== y)) {
              allCellsArr.push([y, x]);
            }
          }
        }
      }
    }
  });

  cells.forEach((cell) => {
    for (let key in allCellsArr) {
      if (
        cell.dataset.x == allCellsArr[key][1] &&
        cell.dataset.y == allCellsArr[key][0]
      ) {
        if (cell.dataset.flag !== "off" && cell.dataset.isWounded !== "yes") {
          filteredCellsArr.push([allCellsArr[key][0], allCellsArr[key][1]]);
        }
      }
    }
  });

  checkRandomAroundCell(shotY, shotX, filteredCellsArr, cells, board);
}

function checkRandomAroundCell(shotY, shotX, aroundCellsArray, cells, board) {
  [woundedY, woundedX] = [shotY, shotX];
  shotFlag = false;

  const randomIndex = Math.floor(Math.random() * aroundCellsArray.length);

  [randomAroundCellY, randomAroundCellX] = [
    aroundCellsArray[randomIndex][0],
    aroundCellsArray[randomIndex][1],
  ];

  cells.forEach((cell) => {
    const conditionCoordinates =
      cell.dataset.x == randomAroundCellX &&
      cell.dataset.y == randomAroundCellY;
    if (
      conditionCoordinates &&
      board[randomAroundCellY][randomAroundCellX] !== 0
    ) {
      getWoundedDeck(cell);

      if (board[randomAroundCellY][randomAroundCellX] == 2) {
        getRandomShot(board, cells);
      } else if (board[randomAroundCellY][randomAroundCellX] == 3) {
        checkThirdCell(
          woundedY,
          woundedX,
          randomAroundCellY,
          randomAroundCellX,
          cells,
          board
        );
      } else if (board[randomAroundCellY][randomAroundCellX] == 4) {
        checkThirdCell(
          woundedY,
          woundedX,
          randomAroundCellY,
          randomAroundCellX,
          cells,
          board
        );
      }
    } else if (
      conditionCoordinates &&
      board[randomAroundCellY][randomAroundCellX] == 0
    ) {
      getMissCell(cell);

      shotFlag = true;
    }
  });
}

function checkThirdCell(
  firstWoundedDeckY,
  firstWoundedDeckX,
  secondWoundedDeckY,
  secondWoundedDeckX,
  cells,
  board
) {
  let filteredArrayCells = [];
  let resultFilteredArrayCells = [];

  if (firstWoundedDeckY == secondWoundedDeckY) {
    if (firstWoundedDeckX < secondWoundedDeckX) {
      if (firstWoundedDeckX - 1 < 0) {
        filteredArrayCells = [[firstWoundedDeckY, firstWoundedDeckX + 2]];
      } else if (firstWoundedDeckX + 2 > 9) {
        filteredArrayCells = [[firstWoundedDeckY, firstWoundedDeckX - 1]];
      } else {
        filteredArrayCells = [
          [firstWoundedDeckY, firstWoundedDeckX - 1],
          [firstWoundedDeckY, firstWoundedDeckX + 2],
        ];
      }
    } else if (firstWoundedDeckX > secondWoundedDeckX) {
      if (secondWoundedDeckX - 1 < 0) {
        filteredArrayCells = [[secondWoundedDeckY, secondWoundedDeckX + 2]];
      } else if (secondWoundedDeckX + 2 > 9) {
        filteredArrayCells = [[secondWoundedDeckY, secondWoundedDeckX - 1]];
      } else {
        filteredArrayCells = [
          [secondWoundedDeckY, secondWoundedDeckX - 1],
          [secondWoundedDeckY, secondWoundedDeckX + 2],
        ];
      }
    }
  } else if (firstWoundedDeckX == secondWoundedDeckX) {
    if (firstWoundedDeckY < secondWoundedDeckY) {
      if (firstWoundedDeckY - 1 < 0) {
        filteredArrayCells = [[firstWoundedDeckY + 2, firstWoundedDeckX]];
      } else if (firstWoundedDeckY + 2 > 9) {
        filteredArrayCells = [[firstWoundedDeckY - 1, firstWoundedDeckX]];
      } else {
        filteredArrayCells = [
          [firstWoundedDeckY - 1, firstWoundedDeckX],
          [firstWoundedDeckY + 2, firstWoundedDeckX],
        ];
      }
    } else if (firstWoundedDeckY > secondWoundedDeckY) {
      if (secondWoundedDeckY - 1 < 0) {
        filteredArrayCells = [[secondWoundedDeckY + 2, secondWoundedDeckX]];
      } else if (secondWoundedDeckY + 2 > 9) {
        filteredArrayCells = [[secondWoundedDeckY - 1, secondWoundedDeckX]];
      } else {
        filteredArrayCells = [
          [secondWoundedDeckY - 1, secondWoundedDeckX],
          [secondWoundedDeckY + 2, secondWoundedDeckX],
        ];
      }
    }
  }

  cells.forEach((cell) => {
    for (let i = 0; i < filteredArrayCells.length; i++) {
      if (
        cell.dataset.x == filteredArrayCells[i][1] &&
        cell.dataset.y == filteredArrayCells[i][0] &&
        cell.dataset.flag == "on"
      ) {
        resultFilteredArrayCells.push(filteredArrayCells[i]);
      }
    }
  });

  if (filteredArrayCells.length == 1) {
    getThirdShot(
      filteredArrayCells,
      cells,
      board,
      firstWoundedDeckY,
      firstWoundedDeckX
    );
  } else {
    getThirdShot(
      resultFilteredArrayCells,
      cells,
      board,
      firstWoundedDeckY,
      firstWoundedDeckX
    );
  }
}

function getThirdShot(
  arrayCells,
  cells,
  board,
  firstWoundedDeckY,
  firstWoundedDeckX
) {
  if (
    arrayCells.length == 1 &&
    board[firstWoundedDeckY][firstWoundedDeckX] == 3
  ) {
    cells.forEach((cell) => {
      if (
        cell.dataset.x == arrayCells[0][1] &&
        cell.dataset.y == arrayCells[0][0]
      ) {
        getWoundedDeck(cell);
        getRandomShot(board, cells);
      }
    });
  } else if (
    arrayCells.length == 2 &&
    board[firstWoundedDeckY][firstWoundedDeckX] == 3
  ) {
    checkNextShot(arrayCells, cells, board);
  }

  if (
    arrayCells.length == 1 &&
    board[firstWoundedDeckY][firstWoundedDeckX] == 4
  ) {
    cells.forEach((cell) => {
      if (
        cell.dataset.x == arrayCells[0][1] &&
        cell.dataset.y == arrayCells[0][0]
      ) {
        getWoundedDeck(cell);
      }
      if (firstWoundedDeckY == arrayCells[0][0]) {
        if (
          cell.dataset.y == arrayCells[0][0] &&
          cell.dataset.x == arrayCells[0][1] + 1 &&
          cell.dataset.flag !== "off"
        ) {
          getWoundedDeck(cell);
          getRandomShot(board, cells);
        } else if (
          cell.dataset.y == arrayCells[0][0] &&
          cell.dataset.x == arrayCells[0][1] - 1 &&
          cell.dataset.flag !== "off"
        ) {
          getWoundedDeck(cell);
          getRandomShot(board, cells);
        }
      } else if (firstWoundedDeckX == arrayCells[0][1]) {
        if (
          cell.dataset.y == arrayCells[0][0] + 1 &&
          cell.dataset.x == arrayCells[0][1] &&
          cell.dataset.flag !== "off"
        ) {
          getWoundedDeck(cell);
          getRandomShot(board, cells);
        } else if (
          cell.dataset.y == arrayCells[0][0] - 1 &&
          cell.dataset.x == arrayCells[0][1] &&
          cell.dataset.flag !== "off"
        ) {
          getWoundedDeck(cell);
          getRandomShot(board, cells);
        }
      }
    });
  } else if (
    arrayCells.length == 2 &&
    board[firstWoundedDeckY][firstWoundedDeckX] == 4
  ) {
    checkNextShot(arrayCells, cells, board);
  }
}

function checkNextShot(arrayCells, cells, board) {
  const randomIndex = Math.floor(Math.random() * arrayCells.length);
  let checkedCellAfterThirdShotArray = [];

  if (
    arrayCells[0][0] == arrayCells[randomIndex][0] &&
    arrayCells[0][1] == arrayCells[randomIndex][1]
  ) {
    checkedCellAfterThirdShotArray[0] = [arrayCells[1][0], arrayCells[1][1]];
  } else if (
    arrayCells[1][0] == arrayCells[randomIndex][0] &&
    arrayCells[1][1] == arrayCells[randomIndex][1]
  ) {
    checkedCellAfterThirdShotArray[0] = [arrayCells[0][0], arrayCells[0][1]];
  }

  cells.forEach((cell) => {
    if (
      arrayCells[randomIndex][0] == cell.dataset.y &&
      arrayCells[randomIndex][1] == cell.dataset.x &&
      board[arrayCells[randomIndex][0]][arrayCells[randomIndex][1]] == 3
    ) {
      getWoundedDeck(cell);
      getRandomShot(board, cells);
    } else if (
      arrayCells[randomIndex][0] == cell.dataset.y &&
      arrayCells[randomIndex][1] == cell.dataset.x &&
      board[arrayCells[randomIndex][0]][arrayCells[randomIndex][1]] == 0
    ) {
      getMissCell(cell);

      for (let i = 0; i < arrayCells.length; i++) {
        if (arrayCells[i] !== arrayCells[randomIndex]) {
          thirdWoundedDeckArray = arrayCells[i];
          thirdWoundedDeckFlag = true;
        }
      }
    } else if (
      arrayCells[randomIndex][0] == cell.dataset.y &&
      arrayCells[randomIndex][1] == cell.dataset.x &&
      board[arrayCells[randomIndex][0]][arrayCells[randomIndex][1]] == 4
    ) {
      getWoundedDeck(cell);
      getLastWoundedDeck(
        arrayCells[randomIndex][0],
        arrayCells[randomIndex][1],
        checkedCellAfterThirdShotArray,
        cells,
        board
      );
    }
  });
}

function getThirdWoundedDeck(
  thirdWoundedDeckArray,
  cells,
  board,
  firstWoundedDeckY,
  firstWoundedDeckX
) {
  thirdWoundedDeckFlag = false;

  cells.forEach((cell) => {
    if (
      cell.dataset.x == thirdWoundedDeckArray[1] &&
      cell.dataset.y == thirdWoundedDeckArray[0] &&
      board[thirdWoundedDeckArray[0]][thirdWoundedDeckArray[1]] == 3
    ) {
      getWoundedDeck(cell);
      getRandomShot(board, cells);
    } else if (
      cell.dataset.x == thirdWoundedDeckArray[1] &&
      cell.dataset.y == thirdWoundedDeckArray[0] &&
      board[thirdWoundedDeckArray[0]][thirdWoundedDeckArray[1]] == 4
    ) {
      getWoundedDeck(cell);
      getFourthDeckAfterMiss(
        thirdWoundedDeckArray,
        cells,
        board,
        firstWoundedDeckY,
        firstWoundedDeckX
      );
    }
  });
}

function getFourthDeckAfterMiss(
  thirdWoundedDeckArray,
  cells,
  board,
  firstWoundedDeckY,
  firstWoundedDeckX
) {
  if (firstWoundedDeckY == thirdWoundedDeckArray[0]) {
    cells.forEach((cell) => {
      if (
        cell.dataset.y == thirdWoundedDeckArray[0] &&
        cell.dataset.x == thirdWoundedDeckArray[1] + 1 &&
        cell.dataset.flag == "on"
      ) {
        getWoundedDeck(cell);
        getRandomShot(board, cells);
      } else if (
        cell.dataset.y == thirdWoundedDeckArray[0] &&
        cell.dataset.x == thirdWoundedDeckArray[1] - 1 &&
        cell.dataset.flag == "on"
      ) {
        getWoundedDeck(cell);
        getRandomShot(board, cells);
      }
    });
  } else if (firstWoundedDeckX == thirdWoundedDeckArray[1]) {
    cells.forEach((cell) => {
      if (
        cell.dataset.y == thirdWoundedDeckArray[0] + 1 &&
        cell.dataset.x == thirdWoundedDeckArray[1] &&
        cell.dataset.flag == "on"
      ) {
        getWoundedDeck(cell);
        getRandomShot(board, cells);
      } else if (
        cell.dataset.y == thirdWoundedDeckArray[0] - 1 &&
        cell.dataset.x == thirdWoundedDeckArray[1] &&
        cell.dataset.flag == "on"
      ) {
        getWoundedDeck(cell);
        getRandomShot(board, cells);
      }
    });
  }
}

function getLastWoundedDeck(
  currentY,
  currentX,
  checkedCellAfterThirdShotArray,
  cells,
  board
) {
  let cellsForCheck = [];

  cellsForCheck[0] = [
    checkedCellAfterThirdShotArray[0][0],
    checkedCellAfterThirdShotArray[0][1],
  ];

  if (currentY == checkedCellAfterThirdShotArray[0][0]) {
    cells.forEach((cell) => {
      if (
        cell.dataset.y == currentY &&
        cell.dataset.x == currentX + 1 &&
        cell.dataset.flag == "on"
      ) {
        cellsForCheck[1] = [currentY, currentX + 1];
      } else if (
        cell.dataset.y == currentY &&
        cell.dataset.x == currentX - 1 &&
        cell.dataset.flag == "on"
      ) {
        cellsForCheck[1] = [currentY, currentX - 1];
      }
    });
    getLastShot(cellsForCheck, cells, board);
  } else if (currentX == checkedCellAfterThirdShotArray[0][1]) {
    cells.forEach((cell) => {
      if (
        cell.dataset.y == currentY + 1 &&
        cell.dataset.x == currentX &&
        cell.dataset.flag == "on"
      ) {
        cellsForCheck[1] = [currentY + 1, currentX];
      } else if (
        cell.dataset.y == currentY - 1 &&
        cell.dataset.x == currentX &&
        cell.dataset.flag == "on"
      ) {
        cellsForCheck[1] = [currentY - 1, currentX];
      }
    });
    getLastShot(cellsForCheck, cells, board);
  }
}

function getLastShot(arrayCells, cells, board) {
  const randomIndex = Math.floor(Math.random() * arrayCells.length);

  if (arrayCells.length == 2) {
    if (
      arrayCells[0][0] == arrayCells[randomIndex][0] &&
      arrayCells[0][1] == arrayCells[randomIndex][1]
    ) {
      fourthWoundedDeckArray = [arrayCells[1][0], arrayCells[1][1]];
    } else if (
      arrayCells[1][0] == arrayCells[randomIndex][0] &&
      arrayCells[1][1] == arrayCells[randomIndex][1]
    ) {
      fourthWoundedDeckArray = [arrayCells[0][0], arrayCells[0][1]];
    }
  }
  cells.forEach((cell) => {
    if (
      arrayCells[randomIndex][0] == cell.dataset.y &&
      arrayCells[randomIndex][1] == cell.dataset.x &&
      board[arrayCells[randomIndex][0]][arrayCells[randomIndex][1]] == 0
    ) {
      getMissCell(cell);
      fourthWoundedDeckFlag = true;
    } else if (
      arrayCells[randomIndex][0] == cell.dataset.y &&
      arrayCells[randomIndex][1] == cell.dataset.x &&
      board[arrayCells[randomIndex][0]][arrayCells[randomIndex][1]] == 4
    ) {
      getWoundedDeck(cell);
      getRandomShot(board, cells);
    }
  });
}

function lastShot(lastCellArray, cells, board) {
  fourthWoundedDeckFlag = false;

  cells.forEach((cell) => {
    if (
      cell.dataset.y == lastCellArray[0] &&
      cell.dataset.x == lastCellArray[1]
    ) {
      getWoundedDeck(cell);
      getRandomShot(board, cells);
    }
  });
}

// Конец: стрельба ИИ
