import { Sprite, CanvasTexture, SpriteMaterial, Scene, OrthographicCamera, WebGLRenderer } from 'three' 
import { ColorMap } from '../utils/colorMap'

export class Colorbar {
    lut: ColorMap
    scene: Scene
    camera: OrthographicCamera
    renderer: WebGLRenderer
    sprite: Sprite

    constructor(
        {lutName, x = 0.5, y = 0, z = 1, min = 0, max = 1, nbr=32}:
        {lutName: string, x?: number, y?: number, z?: number, min?: number, max?: number, nbr?: number})
    {
        this.lut = new ColorMap(lutName, nbr)
        this.sprite = new Sprite( new SpriteMaterial( {
            map: new CanvasTexture( this.lut.createCanvas() )
        } ) )
        this.sprite.scale.x = 0.125

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
