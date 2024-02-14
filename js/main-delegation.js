import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { getCellElementList, getCurrentTurnElement, getReplayGameButton, getULElement } from "./selectors.js";
import { checkGameStatus, highlightWinCells, updateGameStatus } from "./utils.js";

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.LOADING;
let isEndGame = false;
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

function resetCurrentTurn(currentTurn) {
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
        currentTurnElement.classList.add(currentTurn);
    }
}

function toggleTurn() {
    currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

    resetCurrentTurn(currentTurn);
}

function showReplayGameButton(status) {
    const replayGameButton = getReplayGameButton();
    if (!replayGameButton) return;

    if (status !== GAME_STATUS.PLAYING) replayGameButton.classList.add('show');

    isEndGame = true;
}

function handleCellClick(cell, index) {
    const isClicked = cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE);

    if (isClicked || isEndGame) return;

    cell.classList.add(currentTurn);

    // update cellValues
    cellValues[index] = currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;

    toggleTurn();

    const game = checkGameStatus(cellValues);
    switch (game.status) {
        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN: {
            // update game status
            updateGameStatus(game.status);
            // highlight win cells
            highlightWinCells(game.winPositions);
            // show replayGame button
            showReplayGameButton(game.status);
            break;
        }

        case GAME_STATUS.ENDED: {
            // update game status
            updateGameStatus(game.status);
            // show replayGame button
            showReplayGameButton(game.status);
            break;
        }

        default:
            // update game status
            updateGameStatus(game.status);
    }
}

function initCellElementList() {
    const liElementList = getCellElementList();
    liElementList.forEach((cell, index) => {
        cell.dataset.idx = index;
    })

    const ulElement = getULElement();
    ulElement.addEventListener('click', (event) => {
        if (event.target.tagName !== 'LI') return;

        handleCellClick(event.target, parseInt(event.target.dataset.idx));
    })
}

function resetGame() {
    // reset global variables
    currentTurn = TURN.CROSS;
    isEndGame = false;
    cellValues = cellValues.map(() => '');
    gameStatus = GAME_STATUS.LOADING;

    // reset gameStatus
    updateGameStatus(gameStatus);

    // reset currentTurn
    resetCurrentTurn(currentTurn);

    // reset board game
    const cellELementList = getCellElementList();
    for (const cell of cellELementList) {
        cell.className = '';
    }

    // hide replayGame button
    const replayButton = getReplayGameButton();
    if (replayButton) replayButton.classList.remove('show');
}

function initReplayButton() {
    const replayGameButton = getReplayGameButton();
    if (!replayGameButton) return;

    replayGameButton.addEventListener('click', resetGame)
}

(() => {
    initCellElementList();
    initReplayButton();
})();