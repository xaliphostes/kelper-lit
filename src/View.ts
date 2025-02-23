//Controls scene, cam, renderer, and objects in scene.

import { Color, PerspectiveCamera, Scene, WebGLRenderer } from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Surface } from "./Surface"
import { generateIsoValues } from "./utils/generateIsoValues"
import { generateMathSurface } from "./utils/MathSurfaceGenerator"

import { Colorbar } from "./utils/colorbar"
import { ViewportGizmo } from "three-viewport-gizmo"

import { createGizmo } from "./utils/createGizmo"
import { createLights } from "./utils/createLights"


export default class View {
	private renderer: WebGLRenderer
	private scene: Scene
	private camera: PerspectiveCamera
	private controls: OrbitControls
	private surface: Surface
	private colorbar: Colorbar
	private gizmo: ViewportGizmo

	/*
	Possible lut:
	-------------
	"Cooltowarm", 
	"Blackbody", 
	"Grayscale", 
	"Insar", 
	"InsarBanded", 
	"Rainbow", 
	"Igeoss", 
	"Stress", 
	"Blue_White_Red", 
	"Blue_Green_Red", 
	"Spectrum", 
	"Default", 
	"Banded"
	*/

	constructor(canvasElem: HTMLCanvasElement) {
		this.renderer = new WebGLRenderer({
			canvas: canvasElem,
			antialias: true,
		})

		this.camera = new PerspectiveCamera(45, 1, 0.01, 1000)
		this.camera.position.z = 2

		this.scene = new Scene()
		this.scene.background = new Color("gray")

		createLights(this.scene)

		this.controls = new OrbitControls(this.camera, this.renderer.domElement)

		this.gizmo = createGizmo(this.camera, this.renderer, this.controls)

		const { vertices, indices } = generateMathSurface({
			width: 1,
			height: 1,
			resolution: 100,
			scaleZ: 0.5
		})

		// -------------------------------------------------------
		// The important part
		// -------------------------------------------------------
		this.surface = new Surface(vertices, indices, this.scene)
		const attribute = vertices.filter((_, index) => index % 3 === 2);
		const lut = 'Igeoss'
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
		this.colorbar = new Colorbar({
			lutName: lut,
			nbr: nbIsos,
			min: Math.min(...attribute),
			max: Math.max(...attribute)
		})

		// Set initial sizes
		this.onWindowResize(window.innerWidth, window.innerHeight)
	}

	public onWindowResize(vpW: number, vpH: number): void {
		this.renderer.setSize(vpW, vpH)
		this.camera.aspect = vpW / vpH
		this.camera.updateProjectionMatrix()

		this.colorbar.renderer.setSize(60, 200);
		this.gizmo.update();
	}

	// Call from App.ts
	public update(): void {
		this.renderer.render(this.scene, this.camera)
		this.controls.update()
		this.colorbar.render(this.renderer)
		this.gizmo.render();
	}

}