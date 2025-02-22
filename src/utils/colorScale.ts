import { gl } from 'chroma.ts'
import * as d3 from "d3"
import * as fc from "d3fc"
import { Color } from "three"
import { createLut, fromValueToColor } from "./lut-utils"

// See https://observablehq.com/@d3/color-schemes
// See https://blog.scottlogic.com/2019/03/13/how-to-create-a-continuous-colour-range-legend-using-d3-and-d3fc.html


// ---------------------------------------------------------------
// See /Users/fmaerten/devs/js/packages/vinci-app/js/colorScale.js
// ---------------------------------------------------------------
export function colorScale(element: string, lutName: string, min = 0, max = 1, nb = 20, width = 50, height = 150, title = '', style: Map<string, any> = new Map<string, any>([])) {
    const lut = createLut(lutName, nb)
    const colors: any[] = []
    for (let i = 0; i < nb; ++i) {
        const c = fromValueToColor(i / (nb - 1), {
            min: 0,
            max: 1,
            lutTable: lut,
            defaultColor: new Color('white')
        })
        // console.log(chroma)
        colors.push(gl(c[0], c[1], c[2], 1).hex())
    }
    // ---------------------------
    const interpolator = (value: number) => {
        const idx = Math.trunc(value * nb)
        return colors[idx]
    }

    // ---------------------------

    const colourScale = d3
        // .scaleSequential(d3.interpolateViridis)
        .scaleSequential(interpolator)
        .domain([min, max])
    const domain = colourScale.domain()

    const paddedDomain = fc.extentLinear().pad([0.1, 0.1]).padUnit('percent')(
        domain,
    )

    const [Min, Max] = paddedDomain
    const expandedDomain = d3.range(Min, Max, (Max - Min) / height)

    const xScale = d3.scaleBand().domain(["0", "1"]).range([0, width])

    const yScale = d3.scaleLinear().domain(paddedDomain).range([height, 0])

    const svgBar = fc
        .autoBandwidth(fc.seriesSvgBar())
        .xScale(xScale)
        .yScale(yScale)
        .crossValue(0)
        .baseValue((_: any, i: number) => (i > 0 ? expandedDomain[i - 1] : 0))
        .mainValue((d: any) => d)
        .decorate((selection: any) => {
            selection.selectAll('path').style('fill', (d: any) => colourScale(d))
        })

    const axisLabel = fc
        .axisRight(yScale)
        .tickValues([...domain, (domain[1] + domain[0]) / 2])
        .tickSizeOuter([0])
        .tickSizeInner([5])

    const container = d3.select(`#${element}`).html(null) // clear the element

    const legendSvg = container
        .append('svg')
        .attr('height', height)
        .attr('width', width)

    const legendBar = legendSvg.append('g').datum(expandedDomain).call(svgBar)

    const barWidth = Math.abs(legendBar.node().getBoundingClientRect().x)
    legendSvg
        .append('g')
        .attr('transform', `translate(${barWidth + 10}+1)`)
        .datum(expandedDomain)
        .call(axisLabel)
        .select('.domain')
        .attr('visibility', 'hidden')

    container
        .append('g')
        .attr('transform', 'translate(-200)')
        // .style("border", "2px black solid")
        .text(title)

    // container.style("margin", "1em")
    // container.style("position", "absolute")
    // container.style("left", "10px")
    // container.style("top", "420px")

    style.forEach((value, key) => container.style(key, value))
}

// // from https://codepen.io/meodai/pen/GRKdqZb
// function colorScale4() {
//     const getScaleLegend = (
//         scale = chroma.scale(['#f00', '#00f', '#0ff']),
//         labels = new Array(10).fill('').map((d, i) => i)
//     ) => {
//         const $wrap = document.createElement('div');
//         $wrap.innerHTML = labels.reduce((save, label, i) => `
//         ${save}<div style="color: ${scale(i / labels.length).get('lab.l') < 70 ? '#fff' : '#000'}; background-color: ${scale(i / labels.length)};"></div>`, '');
//         return $wrap;
//     }
// }
