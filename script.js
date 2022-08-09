// Начало: построение сетки 10х10 для поля игрока и противника
const playerBoard = document.querySelector(".board-player");
const enemyBoard = document.querySelector(".board-enemy");

for (let i = 0; i < 100; i++) {
  playerBoard.innerHTML += "<div class='board-cell'><div/>";
  // enemyBoard.innerHTML += "<div class='board-cell'><div/>";
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

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);

    battleWagon.hidden = true;

    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

    battleWagon.hidden = false;

    if (!elemBelow) return;

    let droppableBelow = elemBelow.closest(".board-cell");

    if (currentDroppable != droppableBelow) {
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        battleWagon.classList.add(".active");

        getCurrentXY(currentDroppable);
      }
    }
  }

  document.addEventListener("mousemove", onMouseMove);
  function getCurrentXY(elem) {
    document.addEventListener("mousemove", onMouseMove);
    battleWagon.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      battleWagon.classList.remove(".active");
      playerBoard.style.position = "relative";
      playerBoard.append(battleWagon);

      if (battleWagon.offsetWidth == 160 && elem.offsetLeft >= 240) {
        battleWagon.style.left = 240 + "px";
        battleWagon.style.top = elem.offsetTop + "px";
      } else if (battleWagon.offsetHeight == 160 && elem.offsetTop >= 240) {
        battleWagon.style.left = elem.offsetLeft + "px";
        battleWagon.style.top = 240 + "px";
      } else {
        battleWagon.style.left = elem.offsetLeft + "px";
        battleWagon.style.top = elem.offsetTop + "px";
      }

      let initCellX = Math.floor(
        (event.target.getBoundingClientRect().x -
          playerBoard.getBoundingClientRect().x -
          2) /
          40
      );
      let initCellY = Math.floor(
        (event.target.getBoundingClientRect().y -
          playerBoard.getBoundingClientRect().y -
          2) /
          40
      );

      getBoardFilling(battleWagon, initCellX, initCellY);
    };
  }
  battleWagon.ondragstart = function () {
    return false;
  };
};

// Начало: Поворот корабля
document.addEventListener("keydown", function (event) {
  if (event.keyCode == "32" && battleWagon.classList.contains(".active")) {
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

      let droppableBelow = elemBelow.closest(".board-cell");

      if (currentDroppable != droppableBelow) {
        currentDroppable = droppableBelow;
        if (currentDroppable) {
          battleCaser.classList.add(".active");
          getCurrentXY(currentDroppable);
        }
      }
    }

    document.addEventListener("mousemove", onMouseMove);

    function getCurrentXY(elem) {
      document.addEventListener("mousemove", onMouseMove);
      battleCaser.onmouseup = function () {
        document.removeEventListener("mousemove", onMouseMove);
        battleCaser.classList.remove(".active");
        playerBoard.style.position = "relative";
        playerBoard.append(battleCaser);
        if (battleCaser.offsetWidth == 120 && elem.offsetLeft >= 280) {
          battleCaser.style.left = 280 + "px";
          battleCaser.style.top = elem.offsetTop + "px";
        } else if (battleCaser.offsetHeight == 120 && elem.offsetTop >= 280) {
          battleCaser.style.left = elem.offsetLeft + "px";
          battleCaser.style.top = 280 + "px";
        } else {
          battleCaser.style.left = elem.offsetLeft + "px";
          battleCaser.style.top = elem.offsetTop + "px";
        }

        getBoardFilling(battleCaser);
      };
    }

    battleCaser.ondragstart = function () {
      return false;
    };
  };

  // Начало: Поворот корабля
  document.addEventListener("keydown", function (event) {
    if (event.keyCode == "32" && battleCaser.classList.contains(".active")) {
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

      let droppableBelow = elemBelow.closest(".board-cell");

      if (currentDroppable != droppableBelow) {
        currentDroppable = droppableBelow;
        if (currentDroppable) {
          battleDestroyer.classList.add(".active");
          getCurrentXY(currentDroppable);
        }
      }
    }

    document.addEventListener("mousemove", onMouseMove);

    function getCurrentXY(elem) {
      document.addEventListener("mousemove", onMouseMove);
      battleDestroyer.onmouseup = function () {
        document.removeEventListener("mousemove", onMouseMove);

        battleDestroyer.classList.remove(".active");
        playerBoard.style.position = "relative";
        playerBoard.append(battleDestroyer);

        // Начало: Корабль не уходит за пределы поля
        if (battleDestroyer.offsetWidth == 80 && elem.offsetLeft >= 320) {
          battleDestroyer.style.left = 320 + "px";
          battleDestroyer.style.top = elem.offsetTop + "px";
        } else if (
          battleDestroyer.offsetHeight == 80 &&
          elem.offsetTop >= 320
        ) {
          battleDestroyer.style.left = elem.offsetLeft + "px";
          battleDestroyer.style.top = 320 + "px";
        } else {
          battleDestroyer.style.left = elem.offsetLeft + "px";
          battleDestroyer.style.top = elem.offsetTop + "px";
        }
        // Конец: Корабль не уходит за пределы поля

        getBoardFilling(battleDestroyer);
      };
    }

    battleDestroyer.ondragstart = function () {
      return false;
    };
  };

  // Начало: Поворот корабля
  document.addEventListener("keydown", function (event) {
    if (
      event.keyCode == "32" &&
      battleDestroyer.classList.contains(".active")
    ) {
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
          getCurrentXY(currentDroppable);
        }
      }
    }

    document.addEventListener("mousemove", onMouseMove);

    function getCurrentXY(elem) {
      document.addEventListener("mousemove", onMouseMove);
      battleBoat.onmouseup = function () {
        document.removeEventListener("mousemove", onMouseMove);

        playerBoard.style.position = "relative";
        playerBoard.append(battleBoat);
        battleBoat.style.left = elem.offsetLeft + "px";
        battleBoat.style.top = elem.offsetTop + "px";

        getBoardFilling(battleBoat);
      };
    }

    battleBoat.ondragstart = function () {
      return false;
    };
  };
});

// Конец: логика расположения для однопалубного корабля

// Сделать функцию общей

// function getCurrentXY(elem, ship) {
//   document.addEventListener("mousemove", onMouseMove);
//   ship.onmouseup = function () {
//     document.removeEventListener("mousemove", onMouseMove);
//     ship.classList.remove(".active");
//     playerBoard.style.position = "relative";
//     playerBoard.append(ship);

//     if (ship.offsetWidth == 160 && elem.offsetLeft >= 240) {
//       ship.style.left = 240 + "px";
//       ship.style.top = elem.offsetTop + "px";
//     } else if (ship.offsetHeight == 160 && elem.offsetTop >= 240) {
//       ship.style.left = elem.offsetLeft + "px";
//       ship.style.top = 240 + "px";
//     } else {
//       ship.style.left = elem.offsetLeft + "px";
//       ship.style.top = elem.offsetTop + "px";
//     }

//     getBoardFilling(battleWagon);
//   };
// }

// ////////////////////////////////////////////////////////////

function getBoardFilling(ship, initCellX, initCellY) {
  cells.forEach((cell) => {
    let currentCellX = cell.getBoundingClientRect().x;
    let currentCellY = cell.getBoundingClientRect().y;
    let currentPlayerBoardX = ship.getBoundingClientRect().x;
    let currentPlayerBoardY = ship.getBoundingClientRect().y;

    let coordinateX = cells[0].getBoundingClientRect().x;
    let coordinateY = cells[0].getBoundingClientRect().y;
    if (
      currentCellX == currentPlayerBoardX &&
      currentCellY == currentPlayerBoardY
    ) {
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
          if (
            i == (cell.getBoundingClientRect().y - coordinateY) / 40 &&
            j == (cell.getBoundingClientRect().x - coordinateX) / 40
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
              i == (cell.getBoundingClientRect().y - coordinateY) / 40 &&
              j == (cell.getBoundingClientRect().x - coordinateX) / 40
            ) {
              cell.classList.remove("block-field");
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
    function getEmptyField(arr) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (initCellX == j && initCellY == i && ship.offsetWidth / 40 == 4) {
            console.log(
              (cell.getBoundingClientRect().x -
                playerBoard.getBoundingClientRect().x -
                2) /
                40
            );
            // console.log(j, i);
          }
        }
      }
      // console.log(initCellX, initCellY);
      // ship.childNodes.length
    }
    getEmptyField(board);
  });
  // console.log(board);
  return board;
}

// Начало игры

const button = document.querySelector(".start-button");

button.addEventListener("click", function () {
  playerBoard.style.zIndex = -10;
});

////////////////////////////////////////////

document.querySelectorAll(".board-cell").forEach((cell) =>
  cell.addEventListener("click", function (event) {
    console.log(event.target);

    console.log(
      (event.target.getBoundingClientRect().x -
        playerBoard.getBoundingClientRect().x -
        2) /
        40,
      (event.target.getBoundingClientRect().y -
        playerBoard.getBoundingClientRect().y -
        2) /
        40
    );
  })
);

console.log(board);
