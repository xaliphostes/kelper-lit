import { LineSegments, Mesh, Scene } from "three"
import { createSurface } from "./utils/createSurface"
import { createIsoContourFilled } from "./utils/createIsoContoursFilled"
import { createIsoContourLines } from "./utils/createIsoContoursLines"

export class Surface {
    private mesh_: Mesh = undefined
    private isofill_: Mesh = undefined
    private isolines_: LineSegments = undefined
    private scene: Scene = undefined

    constructor(positions: Array<number>, indices: Array<number>, scene: Scene) {
        this.scene = scene
        this.mesh_ = createSurface(positions, indices)

        // Do not add the mesh in the scene.
        // Iso-filled will replace it.
    }

    generateIsos(
        { attribute, isoList, lut = 'Insar', viewFilled = true, viewLines = true }:
        { attribute: number[], isoList: number[], lut?: string, viewFilled?: boolean, viewLines?: boolean })
{
        if (this.isofill_) {
            this.scene.remove(this.isofill_)
        }
        if (this.isolines_) {
            this.scene.remove(this.isolines_)
        }

        if (viewFilled) {
            this.isofill_ = createIsoContourFilled(this.mesh_, attribute, isoList, lut)
            this.scene.add(this.isofill_)
        }

        if (viewLines) {
            this.isolines_ = createIsoContourLines(this.mesh_, attribute, isoList)
            this.scene.add(this.isolines_)
        }
    }
}