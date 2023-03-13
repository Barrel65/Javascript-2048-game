import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const gameBoard = document.getElementById("gameBoard");

const grid = new Grid(gameBoard);
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
readKey();


if (is_touch_device()) {
	gameBoard.style.setProperty('--cell-size', "22vmin");
	document.querySelector(".tile").setProperty('--cell-size', "22vmin");
	document.body.style.position = "fixed";
}



function readKey() {
	if (is_touch_device()) {
		document.addEventListener('touchstart', handleTouchStart, false);
		document.addEventListener('touchmove', handleTouchMove, false);
	} else {
		window.addEventListener("keydown", handleInput, { once: true });
	}
}


//mobile device
var xDown = null;
var yDown = null;

function getTouches(evt) {
	return evt.touches ||             // browser API
		evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
	const firstTouch = getTouches(evt)[0];
	xDown = firstTouch.clientX;
	yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
	if (!xDown || !yDown) {
		return;
	}

	var xUp = evt.touches[0].clientX;
	var yUp = evt.touches[0].clientY;

	var xDiff = xDown - xUp;
	var yDiff = yDown - yUp;

	if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
		if (xDiff > 0) {
			if (!canMoveLeft()) {
				readKey();
				return;
			}
			moveLeft();
		} else {
			if (!canMoveRight()) {
				readKey();
				return;
			}
			moveRight();
		}
	} else {
		if (yDiff > 0) {
			if (!canMoveUp()) {
				readKey();
				return;
			}
			moveUp();
		} else {
			if (!canMoveDown()) {
				readKey();
				return;
			}
			moveDown();
		}
	}
	/* reset values */
	xDown = null;
	yDown = null;

	const newTile = new Tile(gameBoard);
	grid.getRandomEmptyCell().linkTile(newTile);

	if (!canMoveUp() && !canMoveDown() && !canMoveLeft() & !canMoveRight()) {
		alert("Game over!");
		return;
	}

	readKey();
};


//desctop device
function handleInput(event) {
	console.log(event.key);
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


function is_touch_device() {
	return !!('ontouchstart' in window);
}