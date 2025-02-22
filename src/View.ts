//Controls scene, cam, renderer, and objects in scene.

import { AmbientLight, Color, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { Surface } from "./Surface";
import { generateIsoValues } from "./utils/generateIsoValues";
import { generateTerrain } from "./utils/TerrainGenerator";
import { Colorbar } from "./utils/colorbar";

export default class View {
	private renderer: WebGLRenderer
	private scene: Scene
	private camera: PerspectiveCamera
	private controls: TrackballControls
	private surface: Surface
	private colorbar: Colorbar
	private colorbarContainer: HTMLDivElement

	constructor(canvasElem: HTMLCanvasElement) {
		this.renderer = new WebGLRenderer({
			canvas: canvasElem,
			antialias: true,
		})

		this.camera = new PerspectiveCamera(45, 1, 0.01, 1000)
		this.camera.position.z = 2

		this.scene = new Scene()
		this.scene.background = new Color("gray")

		const dirLight1 = new DirectionalLight(0xffffff, 3);
		dirLight1.position.set(100, 100, 100);
		this.scene.add(dirLight1);

		const dirLight2 = new DirectionalLight(0xffffff, 3);
		dirLight2.position.set(-100, -100, -100);
		this.scene.add(dirLight2);

		const ambientLight = new AmbientLight(0xcccccc);
		this.scene.add(ambientLight);

		this.controls = new TrackballControls(this.camera, this.renderer.domElement)

		const { vertices, indices } = generateTerrain({
			width: 1,
			height: 1,
			resolution: 100,
			heightScale: .02,
			smoothing: 0.5,
			withNormals: false
		})

		// -------------------------------------------------------
		// The important part
		// -------------------------------------------------------
		this.surface = new Surface(vertices, indices, this.scene)
		const attribute = vertices.filter((_, index) => index % 3 === 2);
		const lut = 'Igeoss' // "Cooltowarm", "Blackbody", "Grayscale", "Insar", "InsarBanded", "Rainbow", "Igeoss", "Stress", "Blue_White_Red", "Blue_Green_Red", "Spectrum", "Default", "Banded"
		const nbIsos = 30

		this.surface.generateIsos({
			attribute,
			isoList: generateIsoValues(attribute, nbIsos),
			lut,
			viewFilled: true,
			viewLines: true
		})
		// -------------------------------------------------------

		// Create colorbar
		this.setupColorbar(lut, nbIsos, Math.min(...attribute), Math.max(...attribute));

		// Set initial sizes
		this.onWindowResize(window.innerWidth, window.innerHeight)
	}

	public onWindowResize(vpW: number, vpH: number): void {
		this.renderer.setSize(vpW, vpH)
		this.camera.aspect = vpW / vpH
		this.camera.updateProjectionMatrix()
		this.controls.handleResize()

		this.colorbar.renderer.setSize(60, 200);
	}

	public update(): void {
		this.renderer.render(this.scene, this.camera)
		this.controls.update()
		this.colorbar.render(this.renderer)
	}

	private setupColorbar(lutName: string, nbr: number, min: number, max: number) {
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
		this.colorbarContainer = document.createElement('div');
		this.colorbarContainer.style.width = '50px';  // Increased width
		this.colorbarContainer.style.height = '200px'; // Increased height
		wrapper.appendChild(this.colorbarContainer);

		// Add min value label
		const minLabel = document.createElement('div');
		minLabel.textContent = min.toFixed(3);
		minLabel.style.color = 'white';
		minLabel.style.marginTop = '5px';
		minLabel.style.fontFamily = 'Arial, sans-serif';
		wrapper.appendChild(minLabel);

		// Create colorbar
		this.colorbar = new Colorbar({
			lutName,
			min,
			max,
			nbr,
			x: 0,    // Center position
			y: 0,    // Center position
			z: 1     // In front
		});

		// Add colorbar renderer to container
		this.colorbarContainer.appendChild(this.colorbar.renderer.domElement);
	}
}