
if (is_touch_device()) {
	const gameBoard = document.getElementById("gameBoard");
	gameBoard.style.padding = "3vmin";
	gameBoard.style.setProperty('--cell-size', "22vmin");
	document.body.style.position = "fixed";
}




function is_touch_device() {
	return !!('ontouchstart' in window);
}