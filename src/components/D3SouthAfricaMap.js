import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import geoData from '../data/southAfricaGeo.json';
import './D3SouthAfricaMap.css';

const D3SouthAfricaMap = ({ artists, onArtistClick, selectedLocation }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: width * 0.75 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !artists) return;

    // Clear existing content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    // Create projection for South Africa
    const projection = d3.geoMercator()
      .center([25, -29])
      .scale(dimensions.width * 2.5)
      .translate([dimensions.width / 2, dimensions.height / 2]);

    const path = d3.geoPath().projection(projection);

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent([[0, 0], [dimensions.width, dimensions.height]])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Main group
    const g = svg.append('g');

    // Add ocean background
    g.append('rect')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('fill', '#e3f2fd');

    // Draw provinces
    g.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#faf5ff')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 1.5)
      .attr('class', 'province')
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .attr('fill', '#f3e8ff')
          .attr('stroke-width', 2);
      })
      .on('mouseleave', function() {
        d3.select(this)
          .attr('fill', '#faf5ff')
          .attr('stroke-width', 1.5);
      });

    // Add province labels
    g.selectAll('.province-label')
      .data(geoData.features)
      .enter()
      .append('text')
      .attr('class', 'province-label')
      .attr('transform', d => {
        const centroid = path.centroid(d);
        return `translate(${centroid[0]}, ${centroid[1]})`;
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('fill', '#7c3aed')
      .attr('opacity', 0.7)
      .text(d => d.properties.name);

    // Add artist markers (Google Maps style pins)
    const markers = g.selectAll('.artist-marker')
      .data(artists)
      .enter()
      .append('g')
      .attr('class', 'artist-marker')
      .attr('transform', d => {
        const coords = projection([d.lng, d.lat]);
        return `translate(${coords[0]}, ${coords[1]})`;
      })
      .style('cursor', 'pointer');

    // Pin background/shadow
    markers.append('ellipse')
      .attr('cx', 0)
      .attr('cy', 8)
      .attr('rx', 6)
      .attr('ry', 3)
      .attr('fill', 'rgba(0,0,0,0.2)');

    // Pin shape (teardrop)
    markers.append('path')
      .attr('d', 'M 0,-20 C -8,-20 -12,-16 -12,-10 C -12,-4 0,8 0,8 C 0,8 12,-4 12,-10 C 12,-16 8,-20 0,-20 Z')
      .attr('fill', '#8b5cf6')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))')
      .on('mouseenter', function() {
        d3.select(this)
          .attr('fill', '#6d28d9')
          .attr('transform', 'scale(1.15)');
      })
      .on('mouseleave', function() {
        d3.select(this)
          .attr('fill', '#8b5cf6')
          .attr('transform', 'scale(1)');
      });

    // Artist avatar inside pin
    markers.append('circle')
      .attr('cx', 0)
      .attr('cy', -12)
      .attr('r', 6)
      .attr('fill', 'white')
      .style('pointer-events', 'none');

    // Artist initial
    markers.append('text')
      .attr('class', 'pin-text')
      .attr('text-anchor', 'middle')
      .attr('y', -9)
      .attr('font-size', '8px')
      .attr('font-weight', '700')
      .attr('fill', '#8b5cf6')
      .text(d => d.name.charAt(0).toUpperCase())
      .style('pointer-events', 'none');

    // Hover label
    const labels = markers.append('g')
      .attr('class', 'hover-label')
      .attr('opacity', 0);

    labels.append('rect')
      .attr('x', -40)
      .attr('y', -45)
      .attr('width', 80)
      .attr('height', 24)
      .attr('rx', 4)
      .attr('fill', 'white')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1)
      .style('filter', 'drop-shadow(0px 2px 6px rgba(0,0,0,0.15))');

    labels.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -28)
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', '#1f2937')
      .text(d => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name);

    // Show/hide label on hover
    markers.on('mouseenter', function() {
      d3.select(this).select('.hover-label')
        .transition()
        .duration(200)
        .attr('opacity', 1);
    })
    .on('mouseleave', function() {
      d3.select(this).select('.hover-label')
        .transition()
        .duration(200)
        .attr('opacity', 0);
    });

    // Click handler
    markers.on('click', (event, d) => {
      event.stopPropagation();
      if (onArtistClick) {
        onArtistClick(d);
      }
    });

    // Zoom to selected location
    if (selectedLocation && selectedLocation !== 'all') {
      const selectedArtists = artists.filter(a => 
        a.city === selectedLocation || a.province === selectedLocation
      );
      
      if (selectedArtists.length > 0) {
        const bounds = {
          minLng: d3.min(selectedArtists, d => d.lng),
          maxLng: d3.max(selectedArtists, d => d.lng),
          minLat: d3.min(selectedArtists, d => d.lat),
          maxLat: d3.max(selectedArtists, d => d.lat)
        };

        const [[x0, y0], [x1, y1]] = [
          projection([bounds.minLng, bounds.maxLat]),
          projection([bounds.maxLng, bounds.minLat])
        ];

        const scale = Math.min(
          8,
          0.9 / Math.max((x1 - x0) / dimensions.width, (y1 - y0) / dimensions.height)
        );

        const translate = [
          dimensions.width / 2 - (x0 + x1) / 2 * scale,
          dimensions.height / 2 - (y0 + y1) / 2 * scale
        ];

        svg.transition()
          .duration(750)
          .call(
            zoom.transform,
            d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
          );
      }
    } else {
      // Reset zoom
      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
    }

  }, [artists, dimensions, selectedLocation, onArtistClick]);

  return (
    <div ref={containerRef} className="d3-map-container">
      <svg ref={svgRef} className="d3-map-svg"></svg>
    </div>
  );
};

export default D3SouthAfricaMap;
