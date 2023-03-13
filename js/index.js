import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const gameBoard = document.getElementById("gameBoard");

const grid = new Grid(gameBoard);
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
readKey();


function readKey() {
	window.addEventListener("keydown", handleInput, { once: true });
}

function handleInput(event) {
	switch (event.key) {
		case "ArrowUp":
			if (!canMoveUp()) {
				readKey();
				return;
			}
			moveUp();
			break;

		case "ArrowDown":
			if (!canMoveDown()) {
				readKey();
				return;
			}
			moveDown();
			break;

		case "ArrowLeft":
			if (!canMoveLeft()) {
				readKey();
				return;
			}
			moveLeft();
			break;

		case "ArrowRight":
			if (!canMoveRight()) {
				readKey();
				return;
			}
			moveRight();
			break;

		default:
			readKey();
			return;
	}

	const newTile = new Tile(gameBoard);
	grid.getRandomEmptyCell().linkTile(newTile);

	if (!canMoveUp() && !canMoveDown() && !canMoveLeft() & !canMoveRight()) {
		alert("Game over!");
		return;
	}

	readKey();
}

function moveUp() {
	slideTiles(grid.cellsGroupedByColumns)
}

function moveDown() {
	slideTiles(grid.cellsGroupedByReversedColumns)
}

function moveLeft() {
	slideTiles(grid.cellsGroupedByRows)
}

function moveRight() {
	slideTiles(grid.cellsGroupedByReversedRows)
}

function slideTiles(groupedCells) {
	groupedCells.forEach(group => slideTilesInGroup(group));
	grid.cells.forEach(cell => {
		cell.hasTileForMerge() && cell.mergeTiles();
	})

}

function slideTilesInGroup(group) {
	for (let i = 1; i < group.length; i++) {
		if (group[i].isEmpty()) {
			continue;
		}


		const cellWithTile = group[i];
		let targetCell;
		let j = i - 1;
		while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
			targetCell = group[j];
			j--;
		}

		if (!targetCell) {
			continue;
		}

		if (targetCell.isEmpty()) {
			targetCell.linkTile(cellWithTile.linkedTile)
		} else {
			targetCell.linkTileForMerge(cellWithTile.linkedTile);
		}

		cellWithTile.unlinkTile();
	}
}

function canMoveUp() {
	return canMove(grid.cellsGroupedByColumns)
}

function canMoveDown() {
	return canMove(grid.cellsGroupedByReversedColumns)
}
function canMoveLeft() {
	return canMove(grid.cellsGroupedByRows)
}
function canMoveRight() {
	return canMove(grid.cellsGroupedByReversedRows)
}



function canMove(groupedCells) {
	return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
	return group.some((cell, index) => {
		if (index === 0) {
			return false;
		}

		if (cell.isEmpty()) {
			return false;
		}

		return group[index - 1].canAccept(cell.linkedTile);
	})
}