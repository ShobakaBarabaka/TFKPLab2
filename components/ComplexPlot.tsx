import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Complex } from '../utils/mathUtils';

interface ComplexPlotProps {
  data: Complex[][];
  referenceShapes?: Complex[][]; 
  width: number;
  height: number;
  domain: [number, number];
  title: string;
  color: string;
  showBranchCut?: boolean;
}

const ComplexPlot: React.FC<ComplexPlotProps> = ({
  data,
  referenceShapes,
  width,
  height,
  domain,
  title,
  color,
  showBranchCut
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const margin = { top: 30, right: 30, bottom: 30, left: 30 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = useMemo(() => d3.scaleLinear()
    .domain(domain)
    .range([0, innerWidth]), [domain, innerWidth]);

  const yScale = useMemo(() => d3.scaleLinear()
    .domain(domain)
    .range([innerHeight, 0]), [domain, innerHeight]);

  const lineGenerator = d3.line<Complex>()
    .x(d => xScale(d.re))
    .y(d => yScale(d.im))
    .defined(d => !isNaN(d.re) && !isNaN(d.im) && isFinite(d.re) && isFinite(d.im) && Math.abs(d.re) < 100 && Math.abs(d.im) < 100);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); 

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("defs").append("clipPath")
      .attr("id", `clip-${title.replace(/\s/g, '')}`)
      .append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight);

    const plotArea = g.append("g")
      .attr("clip-path", `url(#clip-${title.replace(/\s/g, '')})`);

    plotArea.selectAll(".grid-line")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "grid-line")
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 1)
      .attr("opacity", 0.6);

    if (referenceShapes) {
         plotArea.selectAll(".ref-line")
            .data(referenceShapes)
            .enter()
            .append("path")
            .attr("d", lineGenerator)
            .attr("fill", "none")
            .attr("stroke", "#94a3b8") 
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5");
    }

    const xAxis = d3.axisBottom(xScale).ticks(10).tickSize(-innerHeight).tickPadding(10);
    const yAxis = d3.axisLeft(yScale).ticks(10).tickSize(-innerWidth).tickPadding(10);

    const xAxisGroup = g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis);
    
    const yAxisGroup = g.append("g")
      .call(yAxis);

    g.selectAll(".tick line").attr("stroke", "#e2e8f0"); 
    g.selectAll(".domain").attr("stroke", "#cbd5e1");

    const yZero = yScale(0);
    if (yZero >= 0 && yZero <= innerHeight) {
      g.append("line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", yZero)
        .attr("y2", yZero)
        .attr("stroke", "#64748b")
        .attr("stroke-width", 1.5);
    }
    const xZero = xScale(0);
    if (xZero >= 0 && xZero <= innerWidth) {
      g.append("line")
        .attr("x1", xZero)
        .attr("x2", xZero)
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", "#64748b")
        .attr("stroke-width", 1.5);
    }

    if (showBranchCut) {
        g.append("line")
        .attr("x1", xScale(domain[0])) 
        .attr("x2", xScale(0))       
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
        .attr("stroke", "#ef4444")
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "4,4")
        .attr("opacity", 0.7);
    }

  }, [data, width, height, domain, color, referenceShapes]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <svg ref={svgRef} width={width} height={height} className="bg-white rounded-lg shadow-sm border border-gray-200" />
    </div>
  );
};

export default ComplexPlot;
