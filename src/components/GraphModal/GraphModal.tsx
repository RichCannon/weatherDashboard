import * as d3 from "d3"
import { NumberValue } from "d3"
import { FC, useCallback, useEffect, useRef } from "react"
import { HourlyTemp } from "../../types/types"


import s from './GraphModal.module.scss'

type GraphModalP = {
   dataAll: HourlyTemp | []
}



const GraphModal: FC<GraphModalP> = ({ dataAll }) => {

   const svgRef = useRef<SVGSVGElement>(null)

   const createGraph = useCallback((windowWidth: number) => {


      const getTime = d3.timeFormat("%H:%M")

      const margin = { top: 20, right: 20, bottom: 20, left: 60 }
      const spaceBetweenRect = 2
      const mobileWidth = 500


      const todayData = dataAll
         .filter(t => new Date(t.dt * 1000).getDate() === new Date().getDate())
         .map(d => ({ ...d, dt: getTime(new Date(d.dt * 1000)) }))


      const averageTemp = todayData.reduce((a, b) => a + b.temp, 0) / todayData.length
      const meanDeviation = Math.sqrt(todayData.reduce((prev, cur) => (Math.pow((averageTemp - cur.temp), 2)) + prev, 0) / (todayData.length - 1))

      const width = windowWidth < mobileWidth ? windowWidth : mobileWidth
      const height = window.innerHeight * .75

      const innerWidth = width - (margin.left + margin.right)
      const innerHeight = height - (margin.top + margin.bottom)


      const svg = d3.select(svgRef.current)
         .attr(`width`, width)
         .attr(`height`, height)
         .attr(`preserveAspectRatio`, `none`)

      const g = svg.append(`g`)
         .attr(`transform`, `translate(${margin.left},${0})`)

      const minYScale = `${+(d3.min<typeof todayData[0]>(todayData, d => `${d.temp}`) as string) - meanDeviation}`
      const maxYScale = d3.max<typeof todayData[0]>(todayData, d => `${d.temp}`)

      const yScale = d3.scaleLinear()
         .domain([
            minYScale,
            maxYScale,
         ] as Iterable<NumberValue>)
         .range([innerHeight, 0])

      const xScale = d3.scaleBand()
         .domain(todayData.map(d => d.dt))
         .range([0, innerWidth])

      const xAxis = d3.axisBottom(xScale)
      const yAxis = d3.axisLeft(yScale)

      const xAxisG = g.append(`g`)
      const yAxisG = g.append(`g`)

      xAxis(xAxisG.attr(`transform`, `translate(${0}, ${innerHeight + margin.top + spaceBetweenRect})`))
      yAxis(yAxisG.attr(`transform`, `translate(${-spaceBetweenRect}, ${margin.top})`))
  
      // @ts-ignore
      const lineGenerator = d3.line<HourlyTemp[0]>()
         .curve(d3.curveBasis)
         .x(d => xScale(`${d.dt}`))
         .y(d => yScale(d.temp))


      const rect = g.append(`g`).selectAll(`rect`).data(todayData)
         .enter().append(`rect`).attr(`fill`, `#ccc`)
         .attr(`width`, () => xScale.bandwidth() - spaceBetweenRect)
         .attr(`x`, d => xScale(d.dt)!)
         .attr(`height`, d => innerHeight - yScale(d.temp))
         .attr(`y`, d => yScale(d.temp))
         .attr(`transform`, `translate(${spaceBetweenRect},${margin.top})`)

      const title = rect
         .append('title')
         .attr(`x`, d => xScale(d.dt)!)
         .text((d) => `temperature = ${d.temp}\ntime = ${d.dt}`)

      const path = g.append(`path`)
         .attr(`class`, `${s.linePath}`)
         .attr(`d`, lineGenerator(todayData as HourlyTemp | Iterable<HourlyTemp[0]>))
         .attr(`transform`, `translate(${spaceBetweenRect},${margin.top})`)

      // const tooltip = g.append(`g`)
      //    .selectAll("rect")
      //    .data(todayData)
      //    .enter()
      //    .append(`rect`)
      //    .attr("fill", "#111")
      //    .attr("opacity", "0.5")
      //    //  .attr("class", "bar")
      //    .attr("x", (d) => xScale(d.dt)!)
      //    .attr("width", xScale.bandwidth())
      //    .attr("y", (d) => yScale(d.temp))
      //    .attr("height",d => innerHeight - yScale(d.temp))
      //    .append('title')
      //    .text((d) => `${d.temp}  ${d.dt}`)

      //    .attr(`transform`, `translate(${spaceBetweenRect},${margin.top})`);

      return (window2Width: number) => {

         const width2 = window2Width < mobileWidth ? window2Width : mobileWidth
         const innerWidth2 = width2 - (margin.left + margin.right)

         const fontSize = window2Width < mobileWidth ? 8 : 10
         const xAxis = d3.axisBottom(xScale)
         xAxis(xAxisG.attr(`transform`, `translate(${0}, ${innerHeight + margin.top + spaceBetweenRect})`).attr(`font-size`, fontSize))

         svg.attr(`width`, width2)

         xScale.range([0, innerWidth2])

         path.attr(`class`, `${s.linePath}`)
            .attr(`d`, lineGenerator(todayData as HourlyTemp | Iterable<HourlyTemp[0]>))
            .attr(`transform`, `translate(${spaceBetweenRect},${margin.top})`)

         rect.attr(`width`, () => xScale.bandwidth() - spaceBetweenRect)
            .attr(`x`, d => xScale(d.dt)!)

      }
   }, [dataAll])


   useEffect(() => {
      const resizeGraph = createGraph(window.innerWidth)
      //@ts-ignore
      window.addEventListener(`resize`, (e) => resizeGraph(e.currentTarget.innerWidth))
   }, [])



   // useEffect(() => { 
   //    resizeGraph(window.innerWidth)
   // }, [dataAll])


   return (
      <svg id={`graph`} ref={svgRef}>

      </svg>
   )

}

export default GraphModal