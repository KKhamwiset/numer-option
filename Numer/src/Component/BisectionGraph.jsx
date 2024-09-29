import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { evaluate } from 'mathjs';

const BisectionGraph = ({ data, equation }) => {
  const [equationData, setEquationData] = useState([]);
  const [isValidEquation, setIsValidEquation] = useState(true);

  useEffect(() => {
    const generateEquationData = () => {
      const newEquationData = [];
      try {
        if (data.length > 0) {
          for (let x = -(Math.abs(data[data.length - 1].iteration)); x <= data[data.length - 1].iteration + 1; x += 1) {
            const y = evaluate(equation, { x });
            newEquationData.push({ x, y });
          }
        }
        setIsValidEquation(true);
        setEquationData(newEquationData);
      } catch (error) {
        console.error("Invalid equation:", error.message);
        setIsValidEquation(false);
        setEquationData([]);
      }
    };
    generateEquationData();
  }, [equation, data]);

  const chartData = {
    x: data.map((element) => element.iteration),
    y: data.map((element) => element.Xm),
    type: 'scatter',
    mode: 'lines+markers',
    name: 'X Values (Bisection Method)',
    line: { color: 'rgba(75, 192, 192, 1)' },
  };

  const actualEquationData = {
    x: equationData.map((point) => point.x),
    y: equationData.map((point) => point.y),
    type: 'scatter',
    mode: 'lines',
    name: `y = ${equation} (Actual)`,
    line: { color: 'rgba(54, 162, 235, 1)' },
  };

  const plotData = [chartData, actualEquationData];

  const layout = {
    title: 'Bisection Method Graph with Actual Equation',
    xaxis: {
      title: 'Iterations or X-values',
      gridcolor: 'rgba(0, 0, 0, 0.1)',
    },
    yaxis: {
      title: 'Y-values',
      gridcolor: 'rgba(0, 0, 0, 0.1)',
    },
  };

  return (
    <div>
      <h3 className="text-center text-xl">Bisection Method Graph</h3>
      <div className="flex justify-center w-full" style={{ width: '1200px', height: '400px' }}>
        {isValidEquation ? (
          <Plot data={plotData} layout={layout} />
        ) : (
          <div className="text-red-500">Invalid equation. Please enter a valid mathematical expression.</div>
        )}
      </div>
    </div>
  );
};

export default BisectionGraph;
