import { Cell } from "./cell.js";
const GRID_SIZE = 4;
const CELLS_COUNT = GRID_SIZE * GRID_SIZE;

export class Grid {
	constructor(gameBoard) {
		this.cells = [];
		for (let i = 0; i < CELLS_COUNT; i++) {
			this.cells.push(
				new Cell(gameBoard, i % GRID_SIZE, Math.floor(i / GRID_SIZE))
			)
		}

		this.cellsGroupedByColumns = this.groupCellsByClolumns();
		this.cellsGroupedByReversedColumns = this.cellsGroupedByColumns.map(column => [...column].reverse());
		this.cellsGroupedByRows = this.groupCellsByRows();
		this.cellsGroupedByReversedRows = this.cellsGroupedByRows.map(row => [...row].reverse());
	}

	getRandomEmptyCell() {
		const emptyCells = this.cells.filter(cell => cell.isEmpty());
		const randomIndex = Math.floor(Math.random() * emptyCells.length);
		return emptyCells[randomIndex];
	}

	groupCellsByClolumns() {
		return this.cells.reduce((groupedCells, cell) => {
			groupedCells[cell.x] = groupedCells[cell.x] || [];
			groupedCells[cell.x][cell.y] = cell;
			return groupedCells;
		}, []);
	}

	groupCellsByRows() {
		return this.cells.reduce((groupedCells, cell) => {
			groupedCells[cell.y] = groupedCells[cell.y] || [];
			groupedCells[cell.y][cell.x] = cell;
			return groupedCells;
		}, []);
	}
}

