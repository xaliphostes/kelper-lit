import { BufferAttribute, BufferGeometry } from "three"

export function createBufferGeometry(position: Array<number>, indices: Array<number>): BufferGeometry {
    const geom = new BufferGeometry()

    geom.setAttribute('position', new BufferAttribute(new Float32Array(position), 3))
    geom.setIndex(new BufferAttribute(new Uint32Array(indices), 1))

    geom.computeBoundingBox()
    geom.computeBoundingSphere()

    return geom
}

export function minMax(array: Array<number>): Array<number> {
    let m = Number.POSITIVE_INFINITY
    let M = Number.NEGATIVE_INFINITY
    const n = array.length
    for (let i = 0; i < n; ++i) {
        const a = array[i]
        if (a < m) m = a
        if (a > M) M = a
    }
    return [m, M]
}

export function max(array: Array<number>): number {
    let m = Number.NEGATIVE_INFINITY
    const n = array.length
    for (let i = 0; i < n; ++i) {
        const a = array[i]
        if (a > m) m = a
    }
    return m
}

export function min(array: Array<number>): number {
    let m = Number.POSITIVE_INFINITY
    const n = array.length
    for (let i = 0; i < n; ++i) {
        const a = array[i]
        if (a < m) m = a
    }
    return m
}

export function normalize(array: Array<number>): Array<number> {
    const m = minMax(array)
    return array.map((v) => (v - m[0]) / (m[1] - m[0]))
}

export function scale(array: Array<number>, s: number): Array<number> {
    return array.map((v) => v * s)
}