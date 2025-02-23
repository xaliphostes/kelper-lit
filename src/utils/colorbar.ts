import { Sprite, CanvasTexture, SpriteMaterial, Scene, OrthographicCamera, WebGLRenderer } from 'three' 
import { ColorMap } from '../utils/colorMap'

export class Colorbar {
    lut: ColorMap
    scene: Scene
    camera: OrthographicCamera
    renderer: WebGLRenderer
    sprite: Sprite
    container: HTMLElement

    constructor(
        {container, lutName, x = 0.5, y = 0, z = 1, min = 0, max = 1, nbr=32}:
        {container?: HTMLElement, lutName: string, x?: number, y?: number, z?: number, min?: number, max?: number, nbr?: number})
    {
        this.lut = new ColorMap(lutName, nbr)
        this.sprite = new Sprite( new SpriteMaterial( {
            map: new CanvasTexture( this.lut.createCanvas() )
        } ) )
        this.sprite.scale.x = 0.525
        this.sprite.scale.y = 2

        this.scene = new Scene()
        this.scene.add( this.sprite )

        this.camera = new OrthographicCamera(-1, 1, 1, -1, 1, 2) // left, right, top, bottom, near, far
		this.camera.position.set(x, y, z)

        this.renderer = new WebGLRenderer({
            alpha: true
        })
        this.renderer.setSize(this.lut.canvas.offsetWidth, this.lut.canvas.offsetHeight)
        this.renderer.setPixelRatio(window.devicePixelRatio)

        this.update(lutName, min, max)

        // ----------------------------------

        // Create wrapper container for colorbar and labels
		const wrapper = document.createElement('div');

		wrapper.style.position = 'absolute';
		wrapper.style.top = '20px';
		wrapper.style.right = '20px';
		wrapper.style.display = 'flex';
		wrapper.style.flexDirection = 'column';
		wrapper.style.alignItems = 'center';
		wrapper.style.padding = '10px';
		wrapper.style.background = 'rgba(0, 0, 0, 0.3)';
		wrapper.style.borderRadius = '5px';
		document.body.appendChild(wrapper);

		// Add max value label
		const maxLabel = document.createElement('div');
		maxLabel.textContent = max.toFixed(3);
		maxLabel.style.color = 'white';
		maxLabel.style.marginBottom = '5px';
		maxLabel.style.fontFamily = 'Arial, sans-serif';
		wrapper.appendChild(maxLabel);

		// Create container for colorbar
        if (container) {
            this.container = container
        } else {
		    this.container = document.createElement('div');
        }

		this.container.style.width = '50px';  // Increased width
		this.container.style.height = '200px'; // Increased height
		wrapper.appendChild(this.container);

		// Add min value label
		const minLabel = document.createElement('div');
		minLabel.textContent = min.toFixed(3);
		minLabel.style.color = 'white';
		minLabel.style.marginTop = '5px';
		minLabel.style.fontFamily = 'Arial, sans-serif';
		wrapper.appendChild(minLabel);

		// Create colorbar
		// this.colorbar = new Colorbar({
		// 	lutName,
		// 	min,
		// 	max,
		// 	nbr,
		// 	x: 0,    // Center position
		// 	y: 0,    // Center position
		// 	z: 1     // In front
		// });

		// Add colorbar renderer to container
		this.container.appendChild(this.renderer.domElement);
    }

    render = (renderer: WebGLRenderer) => {
        this.renderer.render( this.scene, this.camera )
    }

    update(lutName: string, min: number, max: number) {
        this.lut.setColorMap( lutName, 32 )
        this.lut.setMax( max )
        this.lut.setMin( min )

        const map = this.sprite.material.map
        this.lut.updateCanvas( map.image )
        map.needsUpdate = true
    }
}
