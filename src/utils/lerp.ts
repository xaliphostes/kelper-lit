/**
 * @brief Linearly interpolates between two values. This name is a contraction of "linear interpolation"
 * @param t The parameter t is clamped to the range [0, 1]
 * @param min The minimum value
 * @param max The minimum value
 * @example
 * ```ts
 * lerp(0  , 1, 5) // 1
 * lerp(0.5, 1, 5) // 3
 * lerp(1  , 1, 5) // 5
 * ```
 * @category Utils
 */
export const lerp = (t: number, min: number, max: number) => {
    if (t<0 || t>1) throw new Error(`t must be clamped to the range [0,1]. Got ${t}`)
    return (1 - t) * min + t * max
}
