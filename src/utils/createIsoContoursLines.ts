import { BufferGeometry, Color, Float32BufferAttribute, LineBasicMaterial, LineSegments, Mesh } from "three"
import { minMax } from "./utils"
import { lerp } from "three/src/math/MathUtils"
import { MarchingTriangles } from "./MarchingTriangles"

export function createIsoContourLines(mesh: Mesh, attribute: number[], isoList: number[]): LineSegments {
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

    const material = new LineBasicMaterial({
        linewidth: 1,
        linecap: 'round',  // ignored by WebGLRenderer
        linejoin: 'round' // ignored by WebGLRenderer
    })
    material["color"] = new Color('black')

    const mm = minMax(attribute)
    const vmin = mm[0]
    const vmax = mm[1]

    const isoValues = isoList

    const algo = new MarchingTriangles()
    algo.setup(mesh.geometry.index, [vmin, vmax])

    const vertices = mesh.geometry.getAttribute('position')
    const positions = []
    let index = 0

    for (let i = 0; i < isoValues.length; ++i) {
        // if (isoValues[i] < parameters.min || isoValues[i] > parameters.max) {
        //     continue
        // }
        let result = algo.isolines(attribute, isoValues[i])
        for (let k = 0; k < result[0].length; ++k) {
            for (let l = 0; l < result[0][k].length - 2; l += 2) {
                let i1 = result[0][k][l]
                let i2 = result[0][k][l + 1]
                let c = result[1][k][l / 2]
                let v1x = vertices.getX(i1)
                let v1y = vertices.getY(i1)
                let v1z = vertices.getZ(i1)
                let v2x = vertices.getX(i2)
                let v2y = vertices.getY(i2)
                let v2z = vertices.getZ(i2)
                positions.push(v1x + c * (v2x - v1x), v1y + c * (v2y - v1y), v1z + c * (v2z - v1z))
                index += 3
            }
        }
    }

    const geom = new BufferGeometry()
    geom.setAttribute('position', new Float32BufferAttribute(positions, 3))
    const skin = new LineSegments(geom, material)
    skin.frustumCulled = false

    return skin
}