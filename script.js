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

const cells = document.querySelectorAll(".board-cell");

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
              cell.style.border = "1px solid black";
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
      cells.forEach((cell) => (cell.style.backgroundColor = ""));
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
      cells.forEach((cell) => (cell.style.backgroundColor = ""));
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
      cells.forEach((cell) => {
        if (boardFriendly[i][j] !== 0) {
          if (j == cell.dataset.x && i == cell.dataset.y) {
            cell.style.backgroundColor = "rgb(65, 186, 168)";
            cell.style.border = "1px solid black";

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
            cell.style.border = "1px solid black";
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
        for (let k = 0; k < shipDeck; k++) {
          if (cy == y && cx == x) {
            boardMatrix[y][x + k] = 1;
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
        for (let k = 0; k < shipDeck; k++) {
          if (cy == y && cx == x) {
            boardMatrix[y + k][x] = 1;
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

// Начало: стрельба ИИ

// Конец: стрельба ИИ

// Начало: Уничтожение кораблей противника

enemyBoard.addEventListener("click", function (event) {
  for (let i = 0; i < enemyBoardMatrix.length; i++) {
    for (let j = 0; j < enemyBoardMatrix.length; j++) {
      if (
        event.target.dataset.x == j &&
        event.target.dataset.y == i &&
        enemyBoardMatrix[i][j] == 1
      ) {
        event.target.style.backgroundColor = "red";
        event.target.style.border = "1px solid black";
        event.target.style.zIndex = -10;

        enemyBoardMatrix[i][j] = 5;
        // alert("Попадание!");

        for (let y = i - 1; y < i + 2; y++) {
          for (let x = j - 1; x < j + 2; x++) {
            if (x >= 0 && y >= 0 && x < 10 && y < 10) {
              if (enemyBoardMatrix[i][j] == 5) {
                // console.log("Корабль потоплен!");
                // console.log([j, i], [x, y], [i, x], [y, j]);
                // if (
                //   (event.target.dataset.x == i &&
                //     event.target.dataset.y == x) ||
                //   (event.target.dataset.x == y && event.target.dataset.y == j)
                // ) {
                //   console.log(event.target.dataset.x, event.target.dataset.y);
                // }
                // if (
                //   enemyBoardMatrix[i][j + 1] !== 1 &&
                //   enemyBoardMatrix[i + 1][j] !== 1 &&
                //   enemyBoardMatrix[i][j - 1] !== 1 &&
                //   enemyBoardMatrix[i - 1][j] !== 1
                // ) {
                //   console.log("Корабль потоплен!");
                // }
                // &&
                // enemyBoardMatrix[i][x] !== 1 &&
                // enemyBoardMatrix[y][j] !== 1
              }
            }
          }
        }
      } else if (
        event.target.dataset.x == j &&
        event.target.dataset.y == i &&
        enemyBoardMatrix[i][j] !== 1
      ) {
        event.target.style.backgroundColor = "yellow";
        event.target.style.border = "1px solid black";
        event.target.style.zIndex = -10;
        // alert("Мимо!");
      }
    }
  }
});

// Конец: Уничтожение кораблей противника
