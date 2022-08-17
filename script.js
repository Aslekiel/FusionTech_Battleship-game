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
    boardRow.dataset.y = y;
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

const wagon = document.querySelector(".battle-wagon-ver");
const casers = document.querySelectorAll(".battle-caser-ver");
const destroyers = document.querySelectorAll(".battle-destroyer-ver");
const boats = document.querySelectorAll(".battle-boat");

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
    if (ship.classList.contains(`battle-${ship}-ver`)) {
      ship.style.left =
        pageX - ship.offsetWidth / (ship.childElementCount * 2) + "px";
      ship.style.top = pageY - ship.offsetHeight / 2 + "px";
    } else {
      ship.style.left = pageX - ship.offsetWidth / 2 + "px";
      ship.style.top =
        pageY - ship.offsetHeight / (ship.childElementCount * 2) + "px";
    }
  }

  let currentDroppable = null;

  onMouseMove(event);

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);

    ship.hidden = true;

    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

    ship.hidden = false;

    if (!elemBelow) return;

    ship.classList.add("active");

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

// Начало: Поворот корабля

function getTurnShip(event, ship) {
  let verticalClass = `battle-${ship}-ver`;
  let horisontalClass = `battle-${ship}-hor`;
  if (event.keyCode == "32" && ship.classList.contains("active")) {
    if (ship.classList.contains(verticalClass)) {
      ship.classList.remove(verticalClass);
      ship.classList.add(horisontalClass);
    } else {
      ship.classList.add(verticalClass);
      ship.classList.remove(horisontalClass);
    }
    event.stopPropagation();
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

independentButton.addEventListener("click", function (event) {
  for (let i = 0; i < 10; i++) {
    battlefieldPlayer[i] = {
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
  ships.forEach((ship) => (ship.style.display = ""));
  shipSelectionUp.style.zIndex = 0;
  shipSelectionDown.style.zIndex = 0;

  event.preventDefault();
});

randomButton.addEventListener("click", function (event) {
  event.preventDefault();

  for (let i = 0; i < 10; i++) {
    battlefieldPlayer[i] = {
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

  getRandomPlacement(4, battlefieldPlayer, boardFriendly);
  getRandomPlacement(3, battlefieldPlayer, boardFriendly);
  getRandomPlacement(3, battlefieldPlayer, boardFriendly);
  getRandomPlacement(2, battlefieldPlayer, boardFriendly);
  getRandomPlacement(2, battlefieldPlayer, boardFriendly);
  getRandomPlacement(2, battlefieldPlayer, boardFriendly);
  getRandomPlacement(1, battlefieldPlayer, boardFriendly);
  getRandomPlacement(1, battlefieldPlayer, boardFriendly);
  getRandomPlacement(1, battlefieldPlayer, boardFriendly);
  getRandomPlacement(1, battlefieldPlayer, boardFriendly);

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

const someArr = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

getRandomPlacement(4, battlefieldEnemy, enemyBoardMatrix);
getRandomPlacement(3, battlefieldEnemy, enemyBoardMatrix);
getRandomPlacement(3, battlefieldEnemy, enemyBoardMatrix);
getRandomPlacement(2, battlefieldEnemy, enemyBoardMatrix);
getRandomPlacement(2, battlefieldEnemy, enemyBoardMatrix);
getRandomPlacement(2, battlefieldEnemy, enemyBoardMatrix);
getRandomPlacement(1, battlefieldEnemy, enemyBoardMatrix);
getRandomPlacement(1, battlefieldEnemy, enemyBoardMatrix);
getRandomPlacement(1, battlefieldEnemy, enemyBoardMatrix);
getRandomPlacement(1, battlefieldEnemy, enemyBoardMatrix);

enemyBoard.style.zIndex = -10;

function getRandomPlacement(shipDeck, battlefield, boardMatrix) {
  const [cx, cy] = [getRandomInt(0, 10), getRandomInt(0, 10)];

  const direction = getRandomInt(0, 2);

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

  // console.log([cy, cx]);
  // console.log([cy, cx], prevCoordinateCell, verifiedCoodinateCell);

  hitShot = false;
  secondShot = false;

  let recurringCell = false;

  cellsArr.forEach((cell) => {
    // if (
    //   (cell.dataset.y == cy &&
    //     cell.dataset.x == cx &&
    //     cell.dataset.flag == "off") ||
    //   (cell.dataset.y == cy &&
    //     cell.dataset.x == cx &&
    //     cell.dataset.isWounded !== "yes")
    // ) {
    //   if (!recurringCell) {
    //     shotCell(board, cellsArr);

    //     recurringCell = true;

    //     cell.dataset.flag = "off";
    //   }
    // }

    if (
      cell.dataset.x == secondShotCoordinateX &&
      cell.dataset.y == secondShotCoordinateY &&
      cx == secondShotCoordinateX &&
      cy == secondShotCoordinateY
    ) {
      enemyBoard.style.zIndex = -10;
      setTimeout(() => {
        cell.style.backgroundColor = "red";
        enemyBoard.style.zIndex = 0;
        cell.dataset.flag = "off";

        secondShot = false;

        shotCell(board, cellsArr);
      }, 500);
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
    shotCell(board, cellsArr);
    hitShot = false;
    // secondShot = false;
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
      setTimeout(() => {
        cell.style.backgroundColor = "red";
        enemyBoard.style.zIndex = 0;
        cell.dataset.flag = "off";
        cell.dataset.isWounded = "yes";
      }, 500);

      if (
        boardFriendly[currentY][currentX] == 2 &&
        boardFriendly[prevY][prevX] == 2
      ) {
        console.log("двухпалубный потоплен");

        hitShot = false;
        setTimeout(() => {
          enemyBoard.style.zIndex = 0;
          shotCell(boardFriendly, cellsFriendly);
        }, 500);
      }

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

      if (currentY == prevY && boardFriendly[currentY][currentX] == 4) {
        checkHorisontalCellsForBattleWagon(
          currentX,
          currentY,
          prevX,
          prevY,
          cellsFriendly,
          boardFriendly
        );
      } else if (currentX == prevX && boardFriendly[currentY][currentX] == 4) {
        checkVerticalCellsForBattleWagon(
          currentX,
          currentY,
          prevX,
          prevY,
          cellsFriendly,
          boardFriendly
        );
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

function checkHorisontalCellsForBattleWagon(
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

  console.log(randomCell);
  console.log("result", resultCheckedCells);

  if (boardFriendly[secondShotCoordinateY][secondShotCoordinateX] !== 0) {
    enemyBoard.style.zIndex = -10;
    console.log("popal");

    let nextCheckCell = [secondShotCoordinateY, secondShotCoordinateX];

    console.log(
      "poluchennoe:",
      [nextCheckCell[0], nextCheckCell[1]],
      "pred:",
      [currentY, currentX],
      "prepre",
      [prevY, prevX]
    );

    if (nextCheckCell[1] > currentX) {
      if (nextCheckCell[1] - 3 < 0) {
        checkedCells = [[currentY, nextCheckCell[1] + 1]];
      } else if (nextCheckCell[1] + 1 > 9) {
        checkedCells = [[currentY, nextCheckCell[1] - 3]];
      } else {
        checkedCells = [
          [currentY, nextCheckCell[1] + 1],
          [currentY, nextCheckCell[1] - 3],
        ];
      }
    } else {
      if (currentX - 3 < 0) {
        checkedCells = [[currentY, currentX + 1]];
      } else if (currentX + 1 > 9) {
        checkedCells = [[currentY, currentX - 3]];
      } else {
        checkedCells = [
          [currentY, currentX - 3],
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

    secondRandomCell = Math.floor(Math.random() * resultCheckedCells.length);

    secondShotCoordinateX = resultCheckedCells[randomCell][1];
    secondShotCoordinateY = resultCheckedCells[randomCell][0];

    console.log(secondShotCoordinateY, secondShotCoordinateX);

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
    }, 1500);

    if (boardFriendly[secondShotCoordinateY][secondShotCoordinateX] !== 0) {
      enemyBoard.style.zIndex = -10;
      console.log("popal");

      if (
        boardFriendly[currentY][currentX] == 4 &&
        boardFriendly[prevY][prevX] == 4
      ) {
        console.log("четырехпалубный потоплен");

        hitShot = false;

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

          shotCell(boardFriendly, cellsFriendly);
        }, 1500);
      }

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
      }, 1500);
    }
  } else {
    console.log("ne popal");

    //   secondShot = true;

    //   setTimeout(() => {
    //     enemyBoard.style.zIndex = 0;

    //     if (boardFriendly[checkedCells[0][0]][checkedCells[0][1]] == 0) {
    //       secondShotCoordinateX = checkedCells[1][1];
    //       secondShotCoordinateY = checkedCells[1][0];
    //     } else {
    //       secondShotCoordinateX = checkedCells[0][1];
    //       secondShotCoordinateY = checkedCells[0][0];
    //     }

    //     cellsFriendly.forEach((cell) => {
    //       if (
    //         cell.dataset.x == secondShotCoordinateX &&
    //         cell.dataset.y == secondShotCoordinateY
    //       ) {
    //         cell.style.backgroundColor = "yellow";

    //         cell.dataset.flag = "off";
    //       }
    //     });
    //   }, 1500);
  }
}

function checkVerticalCellsForBattleWagon(
  currentX,
  currentY,
  prevX,
  prevY,
  cellsFriendly,
  boardFriendly
) {}

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

        shotCell(boardFriendly, cellsFriendly);
      }, 1500);
    }
    if (
      boardFriendly[currentY][currentX] == 4 &&
      boardFriendly[prevY][prevX] == 4
    ) {
    }
  } else {
    secondShot = true;

    setTimeout(() => {
      enemyBoard.style.zIndex = 0;

      if (boardFriendly[checkedCells[0][0]][checkedCells[0][1]] == 0) {
        secondShotCoordinateX = checkedCells[1][1];
        secondShotCoordinateY = checkedCells[1][0];
      } else {
        secondShotCoordinateX = checkedCells[0][1];
        secondShotCoordinateY = checkedCells[0][0];
      }

      cellsFriendly.forEach((cell) => {
        if (
          cell.dataset.x == secondShotCoordinateX &&
          cell.dataset.y == secondShotCoordinateY
        ) {
          // cell.style.backgroundColor = "yellow";

          cell.dataset.flag = "off";
        }
      });
    }, 1500);
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

        shotCell(boardFriendly, cellsFriendly);
      }, 1500);
    }
  } else {
    secondShot = true;

    setTimeout(() => {
      enemyBoard.style.zIndex = 0;

      if (boardFriendly[checkedCells[0][0]][checkedCells[0][1]] == 0) {
        secondShotCoordinateX = checkedCells[1][1];
        secondShotCoordinateY = checkedCells[1][0];
      } else {
        secondShotCoordinateX = checkedCells[0][1];
        secondShotCoordinateY = checkedCells[0][0];
      }

      cellsFriendly.forEach((cell) => {
        if (
          cell.dataset.x == secondShotCoordinateX &&
          cell.dataset.y == secondShotCoordinateY
        ) {
          // cell.style.backgroundColor = "yellow";

          cell.dataset.flag = "off";
        }
      });
    }, 1500);
  }
}

// Конец: стрельба ИИ
