import { Color } from "three"
import { ColorMap, generateColorMap } from '../utils/colorMap'
import { minMax } from "../utils/utils"

/**
 * Create a new Lut and register several tables in it
 * @category Lookup Table 
 */
export function createLut(name: string = "rainbow", nbColors = 32, duplicate = 1) {
    return generateColorMap(name, nbColors, duplicate)
}

/**
 * @param value The value to transform in to a color using a lookup table
 * @param params An object to deal with min, max, lut, default-color and reverse table.
 * The value **must** be normalized.
 * @returns [reg, green, blue]
 * @category Lookup Table 
 */
export function fromValueToColor(
    value: number, 
    {min=0, max=1, lutTable, defaultColor, reverse=false}:
    {min?: number, max?: number, lutTable: ColorMap, defaultColor: Color, reverse?: boolean}):
    [number,number,number]
{
    if (value<0 || value>1) {
        throw new Error(`value *must% be normalized. Got ${value}`)
    }

    let w = reverse ? (1.0-value) : value
    if (w >= min && w <= max) {
        const c = lutTable.getColor(w)
        return [c.r, c.g, c.b]
    }
    
    return [defaultColor.r, defaultColor.g, defaultColor.b]
}

/**
 * @param values 
 * @param param1 
 * @returns 
 * @category Lookup Table 
 */
export function fromValuesToColors(
    values: Array<number>, 
    {defaultColor, lut, duplicateLut=1, min=0, max=1, lockLut=true, reverse=false}:
    {defaultColor: Color, lut: string|ColorMap, duplicateLut?:number, min?: number, max?: number, lockLut?: boolean, reverse?: boolean}): number[]
{
    const lutTable = ( lut instanceof ColorMap ? lut : createLut(lut, 32, duplicateLut) )
    const minmax = minMax(values)
    const vmin = minmax[0]
    const vmax = minmax[1]

    if (lockLut) {
        lutTable.setMin(0).setMax(1)
    } else {
        lutTable.setMin(min).setMax(max)
    }

    let colors = new Array(3 * values.length).fill(0)

    values.forEach( (v, i) => {
        const w = reverse ? (v - vmax)/(vmin-vmax) : (v - vmin)/(vmax-vmin)
        if (w >= min && w <= max) {
            const c = lutTable.getColor(w)
            colors[3*i] = c.r; colors[3*i+1] = c.g; colors[3*i+2] = c.b
        }
        else {
            colors[3*i] = defaultColor.r; colors[3*i+1] = defaultColor.g; colors[3*i+2] = defaultColor.b
        }
    })

    return colors
}
