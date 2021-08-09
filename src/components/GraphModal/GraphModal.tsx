import * as d3 from "d3"
import { FC, useEffect, useRef } from "react"

import { HourlyTemp } from "../../logic/reducers/weatherReducer"
import s from './GraphModal.module.scss'

type GraphModalP = {
   dataAll?: HourlyTemp
}


// function epanechnikov(bandwidth: number) {
//    return (x: number) => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
// }

// function kde(kernel: ReturnType<typeof epanechnikov>, thresholds: number[], data: number[]) {
//    return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d) as any)])
// }



const GraphModal: FC<GraphModalP> = ({ dataAll }) => {

   const svgRef = useRef<SVGSVGElement>(null)


   useEffect(() => {

      if (dataAll) {

         const getTime = d3.timeFormat("%H:%M")
         // const xValue = (x:HourlyTemp[0]) => x.dt
         // const yValue = (y:HourlyTemp[0]) => y.temp

         const margin = { top: 20, right: 20, bottom: 20, left: 60 }


         const todayData = dataAll
            .filter(t => new Date(t.dt * 1000).getDate() === new Date().getDate())
            .map(d => ({ ...d, dt: getTime(new Date(d.dt * 1000)) }))
         // const dataTd = todayData.map(d => d.dt)
         // const dataTemp = todayData.map(d => d.temp)



         const averageTemp = todayData.reduce((a, b) => a + b.temp, 0) / todayData.length
         const meanDeviation = Math.sqrt(todayData.reduce((prev, cur) => (Math.pow((averageTemp - cur.temp), 2)) + prev, 0) / (todayData.length - 1))


         console.log(todayData.map(d => d.temp))

         const width = 500
         const height = 500   

         const innerWidth = width - (margin.left + margin.right)
         const innerHeight = height - (margin.top + margin.bottom)


         const svg = d3.select(svgRef.current).attr(`viewBox`, `0 0 ${width} ${height}`).attr(`preserveAspectRatio`, `none`)

         const g = svg.append(`g`)
            .attr(`transform`, `translate(${margin.left},${0})`)

         //@ts-ignore
         const minYScale = `${+d3.min<typeof todayData[0]>(todayData, d => `${d.temp}`) - meanDeviation}`
         const maxYScale = d3.max<typeof todayData[0]>(todayData, d => `${d.temp}`)

         // console.log(`meanDeviation`,meanDeviation)



         const yScale = d3.scaleLinear()//@ts-ignore
            .domain([//@ts-ignore
               minYScale,//@ts-ignore
               maxYScale,
            ])
            .range([innerHeight, 0])

         const xScale = d3.scaleBand() //@ts-ignore
            .domain(todayData.map(d => d.dt))
            .range([0, innerWidth])

         const xAxis = d3.axisBottom(xScale)

         const yAxis = d3.axisLeft(yScale)

         xAxis(g.append(`g`).attr(`transform`, `translate(${0}, ${innerHeight + margin.top + 2})`))
         yAxis(g.append(`g`).attr(`transform`, `translate(${-2}, ${margin.top})`))

         //@ts-ignore
         const lineGenerator = d3.line<HourlyTemp>() //@ts-ignore
            .x(d => xScale(`${d.dt}`)) //@ts-ignore
            .y(d => yScale(d.temp))


         g.selectAll(`rect`).data(todayData)
            .enter().append(`rect`).attr(`fill`, `#ccc`)
            .attr(`width`, () => xScale.bandwidth() - 2) //@ts-ignore
            .attr(`x`, d => xScale(d.dt))
            .attr(`height`, d => innerHeight - yScale(d.temp))
            .attr(`y`, d => yScale(d.temp))
            .attr(`transform`, `translate(${2},${margin.top})`)

         g.append(`path`)
            .attr(`class`, `${s.linePath}`) //@ts-ignore
            .attr(`d`, lineGenerator(todayData))
            .attr(`transform`, `translate(${2},${margin.top})`)

      }
   }, [dataAll])


   return (
      <svg ref={svgRef}>

      </svg>
   )

}

export default GraphModal