import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { getCellElementAtIdx, getCellElementList, getCurrentTurnElement, getGameStatusElement, getReplayGameButton } from "./selectors.js";
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

function toggleTurn() {
    currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

    const turnElement = getCurrentTurnElement();
    if (turnElement) {
        turnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
        turnElement.classList.add(currentTurn);
    }
}

function updateGameStatus(status) {
    const statusElement = getGameStatusElement();
    if (statusElement) statusElement.textContent = status;
}

function highlightWinCells(winPositions) {
    if (!Array.isArray(winPositions) || winPositions.length !== 3) {
        throw new Error('Invalid win positions');
    }

    for (const cellIndex of winPositions) {
        const winCell = getCellElementAtIdx(cellIndex);
        winCell.classList.add('win');
    }
}

function showReplayGameButton(status) {
    const replayGameButton = getReplayGameButton();
    if (!replayGameButton) return;

    if (status !== GAME_STATUS.PLAYING) replayGameButton.classList.add('show');

    isGameEnded = true;
}

function handleCellClick(cell, index) {
    if (cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE) || isGameEnded) return;

    cell.classList.add(currentTurn);

    // update cellValues
    cellValues[index] = currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;

    toggleTurn();

    const game = checkGameStatus(cellValues);
    switch (game.status) {
        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN:
            // update game status
            updateGameStatus(game.status);
            // highlight win cells
            highlightWinCells(game.winPositions);
            // show replayGame button
            showReplayGameButton(game.status);
            break;

        case GAME_STATUS.ENDED:
            // update game status
            updateGameStatus(game.status);
            // show replayGame button
            showReplayGameButton(game.status);
            break;

        default:
            // update game status
            updateGameStatus(game.status);
    }
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