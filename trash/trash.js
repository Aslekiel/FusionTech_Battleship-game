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
