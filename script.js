// Начало: построение сетки 10х10 для поля игрока и противника
const playerBoard = document.querySelector(".board-player");
const enemyBoard = document.querySelector(".board-enemy");

for (let i = 0; i < 100; i++) {
  playerBoard.innerHTML += "<div class='board-cell'><div/>";
  enemyBoard.innerHTML += "<div class='board-cell'><div/>";
}
// Конец: построение сетки 10х10 для поля игрока и противника

// Начало: логика расположения для четырехпалубного корабля

const battleWagon = document.querySelector(".battle-wagon-ver");

battleWagon.onmousedown = function (event) {
  battleWagon.style.position = "absolute";
  battleWagon.style.zIndex = 1000;
  document.body.append(battleWagon);

  moveAt(event.pageX, event.pageY);

  function moveAt(pageX, pageY) {
    battleWagon.style.left = pageX - battleWagon.offsetWidth / 2 + "px";
    battleWagon.style.top = pageY - battleWagon.offsetHeight / 8 + "px";
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
      battleWagon.style.left = elem.offsetLeft + "px";
      battleWagon.style.top = elem.offsetTop + "px";
    };
  }

  battleWagon.ondragstart = function () {
    return false;
  };
};

// Надо подумать над поворотом корабля
document.addEventListener("keydown", function (event) {
  if (event.keyCode == "32" && battleWagon.classList.contains(".active")) {
    console.log("hey");
    battleWagon.classList.toggle("battle-wagon-hor");

    event.stopPropagation();
  }
});
//////////////////////////////////////////////////////////////

// Конец: логика расположения для четырехпалубного корабля

// Начало: логика расположения для трехпалубного корабля

const battleCasers = document.querySelectorAll(".battle-caser");

battleCasers.forEach((battleCaser) => {
  battleCaser.onmousedown = function (event) {
    battleCaser.style.position = "absolute";
    battleCaser.style.zIndex = 1000;
    document.body.append(battleCaser);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      battleCaser.style.left = pageX - battleCaser.offsetWidth / 2 + "px";
      battleCaser.style.top = pageY - battleCaser.offsetHeight / 6 + "px";
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
          getCurrentXY(currentDroppable);
        }
      }
    }

    document.addEventListener("mousemove", onMouseMove);

    function getCurrentXY(elem) {
      document.addEventListener("mousemove", onMouseMove);
      battleCaser.onmouseup = function () {
        document.removeEventListener("mousemove", onMouseMove);

        playerBoard.style.position = "relative";
        playerBoard.append(battleCaser);
        battleCaser.style.left = elem.offsetLeft + "px";
        battleCaser.style.top = elem.offsetTop + "px";
      };
    }
    battleCaser.ondragstart = function () {
      return false;
    };
  };
});

// Конец: логика расположения для трехпалубного корабля

// Начало: логика расположения для двухпалубного корабля

const battleDestroyers = document.querySelectorAll(".battle-destroyer");

battleDestroyers.forEach((battleDestroyer) => {
  battleDestroyer.onmousedown = function (event) {
    battleDestroyer.style.position = "absolute";
    battleDestroyer.style.zIndex = 1000;
    document.body.append(battleDestroyer);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      battleDestroyer.style.left =
        pageX - battleDestroyer.offsetWidth / 2 + "px";
      battleDestroyer.style.top =
        pageY - battleDestroyer.offsetHeight / 4 + "px";
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
          getCurrentXY(currentDroppable);
        }
      }
    }

    document.addEventListener("mousemove", onMouseMove);

    function getCurrentXY(elem) {
      document.addEventListener("mousemove", onMouseMove);
      battleDestroyer.onmouseup = function () {
        document.removeEventListener("mousemove", onMouseMove);

        playerBoard.style.position = "relative";
        playerBoard.append(battleDestroyer);
        battleDestroyer.style.left = elem.offsetLeft + "px";
        battleDestroyer.style.top = elem.offsetTop + "px";
      };
    }
    battleDestroyer.ondragstart = function () {
      return false;
    };
  };
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
      };
    }
    battleBoat.ondragstart = function () {
      return false;
    };
  };
});

// Конец: логика расположения для однопалубного корабля
