import { Vector3 } from 'three';

export type FieldFunction = (x: number, y: number, z: number) => number;

/**
 * @example
 * // Create a complex scalar field combining multiple features
 * const fieldFn = ScalarFieldGenerator.Fields.customExpression((x, y, z) => {
 *     // Combine multiple field types
 *     const waves = ScalarFieldGenerator.Fields.radialWaves(8, 0.5)(x, y, z);
 *     const gradient = ScalarFieldGenerator.Fields.gradient(new Vector3(1, 1, 0))(x, y, z);
 *     const gaussian = ScalarFieldGenerator.Fields.gaussian(new Vector3(0.3, 0.3, 0), 0.3)(x, y, z);
 *     return 5*waves + 0.5 * gradient + 2 * gaussian;
 * });
 * 
 * // Generate the scalar field values
 * const attribute = ScalarFieldGenerator.generateField(vertices, fieldFn);
*/
export class ScalarFieldGenerator {
    /**
     * Generates scalar field values for vertices of a 3D surface
     * @param vertices Flat array of vertex positions [x1,y1,z1, x2,y2,z2, ...]
     * @param fieldFn Function that computes the scalar value at each point
     * @returns Array of scalar values, one per vertex
     */
    static generateField(vertices: number[], fieldFn: FieldFunction): number[] {
        const values: number[] = [];
        
        // Process vertices in groups of 3 (x,y,z coordinates)
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i + 1];
            const z = vertices[i + 2];
            values.push(fieldFn(x, y, z));
        }
        
        return values;
    }

    // Predefined field functions
    static Fields = {
        /**
         * Distance from origin (0,0,0)
         */
        distanceFromOrigin: (x: number, y: number, z: number): number => {
            return Math.sqrt(x * x + y * y + z * z);
        },

        /**
         * Distance from a point
         * @param point The reference point
         */
        distanceFromPoint: (point: Vector3): FieldFunction => {
            return (x: number, y: number, z: number): number => {
                const dx = x - point.x;
                const dy = y - point.y;
                const dz = z - point.z;
                return Math.sqrt(dx * dx + dy * dy + dz * dz);
            };
        },

        /**
         * Radial waves from origin
         * @param frequency Number of waves
         * @param amplitude Wave height
         */
        radialWaves: (frequency: number = 5, amplitude: number = 1): FieldFunction => {
            return (x: number, y: number, z: number): number => {
                const r = Math.sqrt(x * x + y * y + z * z);
                return amplitude * Math.sin(frequency * r);
            };
        },

        /**
         * Gradient along an axis or direction
         * @param direction Vector indicating direction and rate of change
         */
        gradient: (direction: Vector3): FieldFunction => {
            const norm = Math.sqrt(
                direction.x * direction.x + 
                direction.y * direction.y + 
                direction.z * direction.z
            );
            return (x: number, y: number, z: number): number => {
                return (
                    x * direction.x / norm + 
                    y * direction.y / norm + 
                    z * direction.z / norm
                );
            };
        },

        /**
         * Gaussian "blob" centered at a point
         * @param center Center of the Gaussian
         * @param sigma Width parameter
         */
        gaussian: (center: Vector3, sigma: number = 1): FieldFunction => {
            return (x: number, y: number, z: number): number => {
                const dx = x - center.x;
                const dy = y - center.y;
                const dz = z - center.z;
                const r2 = dx * dx + dy * dy + dz * dz;
                return Math.exp(-r2 / (2 * sigma * sigma));
            };
        },

        /**
         * Multiple Gaussian blobs
         * @param centers Array of center points
         * @param sigmas Array of width parameters (one per center)
         * @param weights Array of weights (one per center)
         */
        multiGaussian: (
            centers: Vector3[], 
            sigmas: number[] = [], 
            weights: number[] = []
        ): FieldFunction => {
            return (x: number, y: number, z: number): number => {
                let value = 0;
                centers.forEach((center, i) => {
                    const sigma = sigmas[i] || 1;
                    const weight = weights[i] || 1;
                    const dx = x - center.x;
                    const dy = y - center.y;
                    const dz = z - center.z;
                    const r2 = dx * dx + dy * dy + dz * dz;
                    value += weight * Math.exp(-r2 / (2 * sigma * sigma));
                });
                return value;
            };
        },

        /**
         * Custom mathematical expression
         * @param expression Function taking x,y,z coordinates
         */
        customExpression: (expression: FieldFunction): FieldFunction => {
            return expression;
        }
    };
}
