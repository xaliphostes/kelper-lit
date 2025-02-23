export interface SurfaceGeometry {
    vertices: number[];    // Flat array of x,y,z coordinates
    indices: number[];     // Flat array of triangle indices
}

export type SurfaceParameters = {
    width: number,
    height: number,
    resolution: number,
    scaleZ: number
}

export function generateMathSurface(params: SurfaceParameters): SurfaceGeometry {
    const surfaceGen = new MathSurfaceGenerator(
        params.width,
        params.height,
        params.resolution,
        params.scaleZ
    );
    return surfaceGen.generate();
}

class MathSurfaceGenerator {
    private width: number;
    private height: number;
    private resolution: number;
    private scaleZ: number

    constructor(
        width: number = 1,         // Width of the surface
        height: number = 1,        // Height of the surface
        resolution: number = 50,    // Number of segments
        scaleZ: number = 1
    ) {
        this.width = width;
        this.height = height;
        this.resolution = resolution;
        this.scaleZ = scaleZ
    }

    private evaluateFunction(x: number, y: number): number {
        // Scale x and y to create multiple periods across the surface
        const scaledX = 6 * (x / this.width);
        const scaledY = 6 * (y / this.height);

        // Combine multiple sinusoidal waves for an interesting pattern
        return this.scaleZ * 0.1 * (
            Math.sin(scaledX) * Math.cos(scaledY) +
            0.5 * Math.sin(2 * scaledX + scaledY) +
            0.25 * Math.cos(3 * scaledX - 2 * scaledY)
        );
    }

    public generate(): SurfaceGeometry {
        const vertices: number[] = [];
        const indices: number[] = [];

        // Generate vertices
        for (let y = 0; y <= this.resolution; y++) {
            for (let x = 0; x <= this.resolution; x++) {
                const xPos = (x / this.resolution) * this.width - this.width / 2;
                const yPos = (y / this.resolution) * this.height - this.height / 2;
                const zPos = this.evaluateFunction(xPos, yPos);

                vertices.push(xPos, yPos, zPos);
            }
        }

        // Generate indices for triangles
        for (let y = 0; y < this.resolution; y++) {
            for (let x = 0; x < this.resolution; x++) {
                const vertexIndex = y * (this.resolution + 1) + x;

                // First triangle
                indices.push(
                    vertexIndex,
                    vertexIndex + this.resolution + 1,
                    vertexIndex + 1
                );

                // Second triangle
                indices.push(
                    vertexIndex + 1,
                    vertexIndex + this.resolution + 1,
                    vertexIndex + this.resolution + 2
                );
            }
        }

        return { vertices, indices };
    }
}