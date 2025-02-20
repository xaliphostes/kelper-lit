import { BufferGeometry, Color, DoubleSide, Float32BufferAttribute, Mesh, MeshPhongMaterial } from "three"
import { IsoContoursFilled } from "./isoContoursFilled"
import { createBufferGeometry } from "./utils"

/**
 * 
 * @param mesh The three.js Mesh (see {@link createSurface})
 * @param attribute The scalar field define at the vertices of the mesh
 * @param isoList The list of iso contours to generate (see {@link generateIsoValues}, {@link generateIsoValuesByNumber} and {@link generateIsoValuesBySpacing})
 * @returns 
 */
export function createIsoContourFilled(mesh: Mesh, attribute: number[], isoList: number[]): Mesh {
    if (mesh === undefined) {
        throw new Error('mesh is undefined')
    }

    if (mesh.geometry === undefined) {
        throw new Error('mesh.geometry is undefined')
    }

    if (mesh.geometry instanceof BufferGeometry === false) {
        throw new Error('mesh.geometry is not a BufferGeometry')
    }

    if (mesh.geometry.getAttribute('position') === undefined) {
        throw new Error('mesh.geometry.position is undefined')
    }

    if (mesh.geometry.index === null) {
        throw new Error('mesh.geometry.index is null')
    }

    if (attribute === undefined) {
        throw new Error('attribute is undefined')
    }

    const iso = new IsoContoursFilled('Insar', 128, isoList)
    const result = iso.run(attribute, mesh.geometry)
    if (result.position.length === 0) return undefined

    const nmesh = new Mesh()
    nmesh.geometry = createBufferGeometry(result.position, result.index)
    nmesh.geometry.setAttribute('color', new Float32BufferAttribute(result.color, 3))
    nmesh.geometry.setAttribute('normal', new Float32BufferAttribute(result.normal, 3))

    nmesh.material = new MeshPhongMaterial({
        color: new Color('white'),
        side: DoubleSide,
        vertexColors: true,
        wireframe: false,
        flatShading: false,
        transparent: false,
        polygonOffset: true,
        polygonOffsetFactor: 1
    })

    return nmesh
}
