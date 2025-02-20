export interface TerrainGeometry {
    vertices: number[];    // Flat array of x,y,z coordinates
    indices: number[];     // Flat array of triangle indices
    normals: number[];     // Flat array of normal vectors
}

export type TerrainGeometryParameters = {
    width: number,
    height: number,
    resolution: number,
    heightScale: number,
    smoothing: number
}

export function generateTerrain(params: TerrainGeometryParameters): TerrainGeometry {
    const terrainGen = new TerrainGenerator(
        params.width,
        params.height,
        params.resolution,
        params.heightScale,
        params.smoothing
    );
    return terrainGen.generate();
}

// =====================================================================

class TerrainGenerator {
    public constructor(
        width: number = 1,         // Width of the terrain
        height: number = 1,        // Height of the terrain
        resolution: number = 50,    // Number of segments
        heightScale: number = 1.0,  // Maximum height of the terrain
        smoothing: number = 1.0     // Smoothing factor for the noise
    ) {
        this.width = width;
        this.height = height;
        this.resolution = resolution;
        this.heightScale = heightScale;
        this.smoothing = smoothing;
    }

    public generate(): TerrainGeometry {
        this.initPermutation();

        const vertices: number[] = [];
        const indices: number[] = [];
        const normals: number[] = [];

        // Generate heightmap
        const heightmap: number[][] = [];
        for (let y = 0; y <= this.resolution; y++) {
            heightmap[y] = [];
            for (let x = 0; x <= this.resolution; x++) {
                const xCoord = (x / this.resolution) * this.width;
                const yCoord = (y / this.resolution) * this.height;
                const height = this.generateNoise(xCoord, yCoord) * this.heightScale;
                heightmap[y][x] = height;
            }
        }

        // Generate vertices and normals
        for (let y = 0; y <= this.resolution; y++) {
            for (let x = 0; x <= this.resolution; x++) {
                const xPos = (x / this.resolution) * this.width - this.width / 2;
                const yPos = (y / this.resolution) * this.height - this.height / 2;
                const zPos = heightmap[y][x];

                vertices.push(xPos, yPos, zPos);

                const normal = this.calculateNormal(x, y, heightmap);
                normals.push(...normal);
            }
        }

        // Generate indices
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

        return { vertices, indices, normals };
    }

    // ---------------------------------------------

    private width: number;
    private height: number;
    private resolution: number;
    private heightScale: number;
    private smoothing: number;

    private generateNoise(x: number, y: number): number {
        // Simple multiple frequency noise function
        let frequency = 1.0 / this.smoothing;
        let amplitude = 1.0;
        let noise = 0;

        for (let i = 0; i < 4; i++) {
            noise += this.perlinNoise(x * frequency, y * frequency) * amplitude;
            frequency *= 2.0;
            amplitude *= 0.5;
        }

        return noise;
    }

    private perlinNoise(x: number, y: number): number {
        // Simple 2D noise function
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        const u = this.fade(x);
        const v = this.fade(y);

        const A = this.p[X] + Y;
        const B = this.p[X + 1] + Y;

        return this.lerp(v,
            this.lerp(u,
                this.grad(this.p[A], x, y),
                this.grad(this.p[B], x - 1, y)
            ),
            this.lerp(u,
                this.grad(this.p[A + 1], x, y - 1),
                this.grad(this.p[B + 1], x - 1, y - 1)
            )
        );
    }

    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private lerp(t: number, a: number, b: number): number {
        return a + t * (b - a);
    }

    private grad(hash: number, x: number, y: number): number {
        const h = hash & 15;
        const grad = 1 + (h & 7);
        return ((h & 8) ? -grad : grad) * x + ((h & 4) ? -grad : grad) * y;
    }

    private readonly p = new Array(512);

    private initPermutation(): void {
        // Initialize permutation table
        const permutation = new Array(256).fill(0).map((_, i) => i);
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
        }
        for (let i = 0; i < 512; i++) {
            this.p[i] = permutation[i & 255];
        }
    }

    private calculateNormal(x: number, y: number, heightmap: number[][]): number[] {
        const scale = this.width / this.resolution;
        const h = heightmap[y][x];

        // Get heights of adjacent vertices
        const hL = x > 0 ? heightmap[y][x - 1] : h;
        const hR = x < this.resolution ? heightmap[y][x + 1] : h;
        const hD = y > 0 ? heightmap[y - 1][x] : h;
        const hU = y < this.resolution ? heightmap[y + 1][x] : h;

        // Calculate normal using central differences
        const normal = [
            (hL - hR) / (2 * scale),
            (hD - hU) / (2 * scale),
            1.0
        ];

        // Normalize
        const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
        return normal.map(n => n / length);
    }
}
