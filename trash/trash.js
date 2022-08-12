// const battleWagon = document.querySelector(".battle-wagon");
// const battleDestroyer = document.querySelector(".battle-destroyer");

// battleWagon.addEventListener("dragstart", dragstart);
// battleWagon.addEventListener("dragend", dragend);

// const placeholders = document.querySelectorAll(".board-cell");

// // battleDestroyer.addEventListener("dragstart", dragstart);
// // battleDestroyer.addEventListener("dragend", dragend);

// placeholders.forEach((placeholder) => {
//   placeholder.addEventListener("dragover", dragover);
//   placeholder.addEventListener("dragenter", dragenter);
//   placeholder.addEventListener("dragleave", dragleave);
//   placeholder.addEventListener("drop", dragdrop);
// });

// function dragstart(event) {
//   setTimeout(() => event.target.classList.add("hide"), 0);
// }

// function dragend(event) {
//   event.target.className = "battle-wagon";
//   // event.target.className = "battle-destroyer";
// }

// function dragover(event) {
//   event.preventDefault();
//   // console.log("dragover");
// }

// function dragenter(event) {
//   event.target.classList.add("hovered");
//   // console.log("dragenter");
// }

// function dragleave(event) {
//   event.target.classList.remove("hovered");
//   // console.log("dragleave");
// }

// function dragdrop(event) {
//   event.target.append(battleWagon);
//   // event.target.append(battleDestroyer);
// }

//////////////////////////////
//CSS

// .hide {
//     display: none;
//   }

//   .hovered {
//     border: 1px solid red;
//   }

/////////////////
// for (let i = 0; i < board.length; i++) {
//     if (i == Array.from(cells).indexOf(cell)) {
//       board[i] = 1;
//     }
//     ship.addEventListener("mousedown", function () {
//       if (i == Array.from(cells).indexOf(cell)) {
//         board[i] = 0;
//       }
//     });
//   }

// if (
//     currentCellX == currentPlayerBoardX &&
//     currentCellY == currentPlayerBoardY
//   ) {
//     if (ship.offsetWidth / 40 == 2) {
//       // Бока
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) - 1
//       ].classList.add("block-field");
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) + 2
//       ].classList.add("block-field");

//       // Верх
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) - 8
//       ].classList.add("block-field");
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) - 9
//       ].classList.add("block-field");
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) - 10
//       ].classList.add("block-field");
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) - 11
//       ].classList.add("block-field");

//       // Низ
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) + 9
//       ].classList.add("block-field");
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) + 10
//       ].classList.add("block-field");
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) + 11
//       ].classList.add("block-field");
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) + 12
//       ].classList.add("block-field");
//     } else if (ship.offsetHeight / 40 == 2) {
//       // Бока
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) - 1
//       ].classList.add("block-field");
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) + 1
//       ].classList.add("block-field");
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) + 9
//       ].classList.add("block-field");
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) + 10
//       ].classList.add("block-field-white");
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) + 11
//       ].classList.add("block-field");

//       // Верх
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) - 9
//       ].classList.add("block-field");
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) - 10
//       ].classList.add("block-field");
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) - 11
//       ].classList.add("block-field");

//       // Низ
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) + 19
//       ].classList.add("block-field");
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) + 20
//       ].classList.add("block-field");
//       playerBoard.childNodes[
//         Array.from(cells).indexOf(cell) + 21
//       ].classList.add("block-field");
//     }
//   }

// if (
//   cell.dataset.x ==
//     Number(elem.dataset.x) + ship.childElementCount - 1 &&
//   cell.dataset.y == elem.dataset.y &&
//   cell.classList.contains("block-field")
// ) {
//   alert("Увы, здесь корабль не поставить!");
//   document.querySelector(".ship-selection__up").append(ship);
// }

////////////////////////////// test
// getEmptyField(battleWagon, elemBelow, droppableBelow);
// function getEmptyField(ship, elem, cell) {
//   let currentPlayerBoardX = ship.getBoundingClientRect().x;
//   let currentPlayerBoardY = ship.getBoundingClientRect().y;

//   let initCellX = Math.floor(
//     (currentPlayerBoardX - playerBoard.getBoundingClientRect().x - 2) / 40
//   );
//   let initCellY = Math.floor(
//     (currentPlayerBoardY - playerBoard.getBoundingClientRect().y - 2) / 40
//   );

//   console.log(initCellX);
//   console.log(elem.dataset.x);
//   console.log(initCellY == elem.dataset.y);
//   console.log(ship.offsetWidth / 40 == ship.childElementCount);
//   if (
//     initCellX == elem.dataset.x &&
//     initCellY == elem.dataset.y &&
//     ship.offsetWidth / 40 == ship.childElementCount
//   ) {
//     if (
//       cell.dataset.x == Number(elem.dataset.x) + ship.childElementCount - 1 &&
//       cell.dataset.y == elem.dataset.y &&
//       cell.classList.contains("block-field")
//     ) {
//       alert("Увы, здесь корабль не поставить!");
//       console.log(elem);

//       // document.querySelector(".ship-selection__up").append(ship);
//     }

//     for (let y = initCellY - 1; y < initCellY + 2; y++) {
//       for (
//         let x = initCellX - 1;
//         x < initCellX + ship.childElementCount + 1;
//         x++
//       ) {
//         if (cell.dataset.x == x && cell.dataset.y == y) {
//           cell.classList.add("block-field");
//         }
//       }
//     }
//   }

//   if (
//     initCellX == elem.dataset.x &&
//     initCellY == elem.dataset.y &&
//     ship.offsetHeight / 40 == ship.childElementCount
//   ) {
//     if (
//       cell.dataset.x == elem.dataset.x &&
//       cell.dataset.y == Number(elem.dataset.y) + ship.childElementCount - 1 &&
//       cell.classList.contains("block-field")
//     ) {
//       alert("Увы, здесь корабль не поставить!");
//     }

//     for (
//       let y = initCellY - 1;
//       y < initCellY + ship.childElementCount + 1;
//       y++
//     ) {
//       for (let x = initCellX - 1; x < initCellX + 2; x++) {
//         if (cell.dataset.x == x && cell.dataset.y == y) {
//           cell.classList.add("block-field");
//         }
//       }
//     }
//   }
// }

// ///////////////////////////////// test

// enemyBoardMatrix[i][x] == 1 &&
// enemyBoardMatrix[y][j] == 1
