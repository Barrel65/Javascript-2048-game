export class Tile {
	constructor(gameBoard) {
		this.tileElement = document.createElement('div');
		this.tileElement.classList.add('tile');
		this.setValue(Math.random() > 0.5 ? 4 : 2);
		gameBoard.append(this.tileElement);
	}

	setXY(x, y) {
		this.x = x;
		this.y = y;
		this.tileElement.style.setProperty('--x', x);
		this.tileElement.style.setProperty('--y', y);
	}

	setValue(value) {
		this.value = value;
		this.tileElement.textContent = value;
		const bgLightness = 100 - Math.log2(value) * 9;
		this.tileElement.style.setProperty('--bg-lightness', `${bgLightness}%`);
		this.tileElement.style.setProperty('--txt-lightness', `bgLightness<50 ? 90 : 10)%`);
	}

	removeFromDOM() {
		this.tileElement.remove();
	}
}