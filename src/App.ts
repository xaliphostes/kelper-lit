import View from "./View"

class App {
	private view: View

	constructor() {
		const canvasBox = <HTMLCanvasElement>document.getElementById("webgl-canvas")
		this.view = new View(canvasBox)

		window.addEventListener("resize", this.resize)
		this.update()
	}

	private resize = (): void => {
		this.view.onWindowResize(window.innerWidth, window.innerHeight)
	}

	private update = (): void => {
		this.view.update()
		requestAnimationFrame(this.update)
	}
}

const app = new App()