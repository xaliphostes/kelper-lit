import { Mesh, Color, MeshPhongMaterial, DoubleSide, Material } from 'three'
import { createBufferGeometry } from './utils'

/**
 * 
 * @param positions The array of vertex position (flat array)
 * @param indices The array of indices (flat array)
 * @param material 
 * @returns 
 */
export function createSurface(positions: Array<number>, indices: Array<number>, material?: Material): Mesh {

    if (positions === undefined) throw new Error('positions is undefined')
    if (indices === undefined) throw new Error('indices is undefined')

    const mesh = new Mesh()

    mesh.geometry = createBufferGeometry(positions, indices)

    if (material) {
        mesh.material = material
    } else {
        mesh.material = new MeshPhongMaterial({
            color: new Color("gray"),
            side: DoubleSide,
            vertexColors: false,
            wireframe: false,
            flatShading: true,
            transparent: false,
            emissive: 0x0c0c0, 
            specular: 0x050505,
            shininess: 500, 
            polygonOffset: true,
            polygonOffsetFactor: 1,
        })
    }

    mesh.material.needsUpdate = true
    mesh.geometry.computeBoundingBox()

    return mesh
}
