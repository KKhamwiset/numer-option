import React from 'react';
import Plot from 'react-plotly.js';
import { evaluate } from 'mathjs';

const Graph = ({ method, data, equation }) => {
  const generateFX = (X) => {
    try {
      if (!equation) return Array(X.length).fill(null);
      return X.map(x => evaluate(equation, { x }));
    } catch (error) {
      return Array(X.length).fill(null);
    }
  };

  const generateActualFunction = (xMin, xMax) => {
    const points = method === "onepoint" ? 30 : 100;
    const xValues = Array.from(
      { length: points },
      (_, i) => xMin + (i * (xMax - xMin)) / (points - 1)
    );
    return {
      x: xValues,
      y: generateFX(xValues)
    };
  };

  const getXRange = () => {
    const xValues = data.map(item => {
      if (method === 'bisection') return [item.Xl, item.Xm, item.Xr];
      if (method === 'false-position') return [item.C];
      if (method === 'graphical') return [item.X];
      if (method === 'newton') return [item.X];
      if (method === 'onepoint') return [item.X];
      return [item.X];
    }).flat();

    const xMin = Math.min(...xValues) - 1;
    const xMax = Math.max(...xValues) + 1;
    return { xMin, xMax };
  };

  const generatePlotData = () => {
    const { xMin, xMax } = getXRange();
    const actualFunction = generateActualFunction(xMin, xMax);
    const functionCurve = equation ? {
      x: actualFunction.x,
      y: actualFunction.y,
      mode: 'lines',
      name: `f(x) = ${equation}`,
      line: { color: '#2196F3' }
    } : null;

    const zeroLine = ['newton', 'secant'].includes(method) ? {
      x: [xMin, xMax],
      y: [0, 0],
      mode: 'lines',
      name: 'y = 0',
      line: { color: '#333333', width: 1 }
    } : null;

    let methodSpecificData = [];

    switch (method) {
      case 'bisection':
        const xmValues = data.map(item => item.Xm);
        const markerColors = xmValues.map((value, index) => {
          if (index === 0) return 'magenta'; 
          return value < xmValues[index - 1] ? 'magenta' : 'red';
        });
      
        methodSpecificData = [
          {
            x: data.map(item => item.Xm),
            y: data.map(item => item.fxm),
            mode: 'lines+markers',
            name: 'XM values',
            line: { color: 'cyan' },
            marker: { 
              color: markerColors,
              size: 8 
            }
          }
        ];
        break;

      case 'false-position':
        methodSpecificData = [
          {
            x: data.map(item => item.C),
            y: data.map(item => item.Fc),
            mode: 'lines+markers',
            name: 'False-Position C values',
            marker: { color: 'cyan' }
          }
        ];
        break;

      case 'graphical':
        methodSpecificData = [
          {
            x: data.map(item => item.X),
            y: data.map(item => item.fx),
            mode: 'lines+markers',
            name: 'Graphical Method X values',
            line : { color: 'cyan' },
            marker: { color: 'magenta' }
          }
        ];
        break;

      case 'newton':
        const iterationPoints = {
          x: data.map(item => item.X),
          y: data.map(item => item.fx),
          mode: 'markers',
          name: 'Iterations',
          marker: { color: '#212121', size: 5, symbol: 'circle' }
        };

        const tangentAndSteps = data.slice(0, -1).map((item, index) => {
          const nextItem = data[index + 1];
          const slope = item.dfx;
          const x1 = item.X - 0.5;
          const x2 = item.X + 0.5;
          const y1 = item.fx - (slope * 0.5);
          const y2 = item.fx + (slope * 0.5);
          
          return [
            {
              x: [x1, x2],
              y: [y1, y2],
              mode: 'lines',
              name: 'Tangent',
              line: { color: '#FF4081', dash: 'solid', width: 1 },
              showlegend: false
            },
            {
              x: [item.X, nextItem.X],
              y: [item.fx, 0],
              mode: 'lines',
              name: 'Steps',
              line: { color: '#FF4081', dash: 'solid', width: 1 },
              showlegend: false
            }
          ];
        }).flat();

        methodSpecificData = [iterationPoints, ...tangentAndSteps];
        break;

      case 'onepoint':
        const yEqualsXLine = {
          x: actualFunction.x,
          y: actualFunction.x,
          mode: 'lines',
          name: 'y = x',
          line: { color: 'black' }
        };

        const iterationSteps = {
          x: data.map(item => item.X),
          y: data.map(item => item.fx),
          mode: 'lines',
          name: 'Iteration',
          marker: { color: 'red' }
        };

        const cobwebLines = data.slice(0, -1).map((item, index) => {
          const nextItem = data[index + 1];
          return [
            {
              x: [item.X, item.X],
              y: [item.X, item.fx],
              mode: 'lines',
              line: { color: 'blue', dash: 'solid', width: 0.9 },
              showlegend: false
            },
            {
              x: [item.X, nextItem.X],
              y: [item.fx, item.fx],
              mode: 'lines',
              line: { color: 'blue', dash: 'solid', width: 0.9 },
              showlegend: false
            }
          ];
        }).flat();

        methodSpecificData = [yEqualsXLine, iterationSteps, ...cobwebLines];
        break;

      case 'secant':
        const secantPoints = {
          x: data.map(item => item.X),
          y: data.map(item => item.fx),
          mode: 'markers',
          name: 'Iterations',
          marker: { color: '#212121', size: 5, symbol: 'circle' }
        };

        const secantLines = data.slice(0, -1).map((item, index) => {
          const nextItem = data[index + 1];
          return [
            {
              x: [item.X, nextItem.X],
              y: [item.fx, nextItem.fx],
              mode: 'lines',
              name: 'Secant',
              line: { color: '#FF4081', dash: 'solid', width: 1 },
              showlegend: index === 0
            },
            {
              x: [nextItem.X, nextItem.X],
              y: [0, nextItem.fx],
              mode: 'lines',
              name: 'Steps',
              line: { color: '#FF4081', dash: 'solid', width: 1 },
              showlegend: false
            }
          ];
        }).flat();

        methodSpecificData = [secantPoints, ...secantLines];
        break;
    }

    return [
      ...(functionCurve ? [functionCurve] : []),
      ...(zeroLine ? [zeroLine] : []),
      ...methodSpecificData
    ].filter(Boolean);
  };

  const getTitle = () => {
    const titles = {
      'bisection': 'Bisection Method Graph',
      'false-position': 'False-Position Method Graph',
      'graphical': 'Graphical Method Graph',
      'newton': 'Newton-Raphson Method Graph',
      'onepoint': 'One-Point Iteration Graph',
      'secant': 'Secant Method Graph'
    };
    return titles[method] || 'Error : can\'t find title';
  };

  const layout = {
    title: '',
    xaxis: {
      title: method === 'bisection' ? 'Iterations' : 'X values',
      gridcolor: '#E0E0E0',
      zerolinecolor: '#9E9E9E'
    },
    yaxis: {
      title: method === 'bisection' ? 'X-Values' : 'f(x)',
      gridcolor: '#E0E0E0',
      zerolinecolor: '#9E9E9E'
    },
    dragmode: 'pan',
    legend: {
      orientation: 'h',
      x: 0,
      y: 4
    },
    showlegend: true,
    plot_bgcolor: '#FFFFFF',
    paper_bgcolor: '#FFFFFF'
  };

  return (
    <div className="flex justify-center flex-col">
      <h3 className="text-center text-xl mt-10 mb">{getTitle()}</h3>
      <div className="sm:w-1/2 md:w-max lg:w-max h-max">
        <Plot
          data={generatePlotData()}
          layout={layout}
          config={{ scrollZoom: true }}
          className="sm:w-1/4vh md:w-max lg:w-max h-max"
        />
      </div>
    </div>
  );
};

export default Graph;