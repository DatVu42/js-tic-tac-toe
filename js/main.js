import { TURN } from "./constants.js";
import { getCellElementAtIdx, getCellElementList, getCurrentTurnElement, getGameStatusElement } from "./selectors.js";
import { checkGameStatus } from "./utils.js";

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill("");

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', 'X']));
console.log(checkGameStatus(['O', 'O', 'O', '', 'X', '', '', 'O', 'X']));
console.log(checkGameStatus(['O', 'X', 'O', 'O', 'X', 'O', 'X', 'O', 'X']));
console.log(checkGameStatus(['O', 'X', 'O', 'O', 'X', 'O', 'X', '', 'X']));

function toggleTurn() {
    currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

    const turnElement = getCurrentTurnElement();
    if (turnElement) {
        turnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
        turnElement.classList.add(currentTurn);
    }
}

function handleCellClick(cell, index) {
    if (cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE)) return;

    cell.classList.add(currentTurn);

    toggleTurn();
}

function initCellElementList() {
    const cellElementList = getCellElementList();

    cellElementList.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            handleCellClick(cell, index);
        })
    })
}

(() => {
    initCellElementList();
})()