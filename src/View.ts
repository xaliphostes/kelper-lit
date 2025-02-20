//Controls scene, cam, renderer, and objects in scene.

import { AmbientLight, Color, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { Surface } from "./Surface";
import { generateIsoValues } from "./utils/generateIsoValues";
import { minMax } from "./utils/utils";
import { generateTerrain } from "./utils/TerrainGenerator";

export default class View {
	private renderer: THREE.WebGLRenderer
	private scene: THREE.Scene
	private camera: THREE.PerspectiveCamera
	private controls: TrackballControls
	private surface: Surface


	constructor(canvasElem: HTMLCanvasElement) {
		this.renderer = new WebGLRenderer({
			canvas: canvasElem,
			antialias: true,
		})
		this.camera = new PerspectiveCamera(45, 1, 0.01, 1000)
		this.camera.position.z = 2

		this.scene = new Scene()
		this.scene.background = new Color("gray")

		const dirLight1 = new DirectionalLight(0x111111, 3);
		dirLight1.position.set(100, 100, 100);
		this.scene.add(dirLight1);

		const dirLight2 = new DirectionalLight(0x111111, 3);
		dirLight2.position.set(-100, -100, -100);
		this.scene.add(dirLight2);

		const ambientLight = new AmbientLight(0xcccccc);
		this.scene.add(ambientLight);

		this.controls = new TrackballControls(this.camera, this.renderer.domElement)

		const terrain = generateTerrain({ width: 1, height: 1, resolution: 100, heightScale: .02, smoothing: 0.7 })

		// -------------------------------------------------------
		// The important part
		// -------------------------------------------------------
		this.surface = new Surface(terrain.vertices, terrain.indices, this.scene)

		const attribute: number[] = []
		for (let i = 0; i < terrain.vertices.length; i += 3) {
			attribute.push(terrain.vertices[i + 2])
		}
		const mm = minMax(attribute)
		this.surface.generateIsos(attribute, generateIsoValues(mm[0], mm[1], 20), 'PuRd_r', true)
		// -------------------------------------------------------

		// Set initial sizes
		this.onWindowResize(window.innerWidth, window.innerHeight)
	}

	public onWindowResize(vpW: number, vpH: number): void {
		this.renderer.setSize(vpW, vpH)
		this.camera.aspect = vpW / vpH
		this.camera.updateProjectionMatrix()
		this.controls.handleResize()
	}

	public update(): void {
		this.renderer.render(this.scene, this.camera)
		this.controls.update()
	}
}