import Plot from "react-plotly.js";
import { evaluate } from "mathjs";

const NewtonRhapsonGraph = ({ data, equation }) => {

  const generateFX = (X) => {
    try {
      if (!equation) {
        return Array(X.length).fill(null);
      }
      return X.map(x => evaluate(equation, { x }));
    } catch (error) {
      return Array(X.length).fill(null);
    }
  };


  const xValues = Array.from({ length: data.length * 2 }, (_, i) => i * 0.5);


  const functionFX = {
    x: xValues,
    y: generateFX(xValues),
    mode: 'lines',
    name: `f(x) = ${equation || 'Invalid Equation'}`,
    line: { color: 'green' },
  };


  const yEqualsXLine = {
    x: xValues,
    y: xValues,
    mode: 'lines',
    name: 'y = x',
    line: { color: 'black' },
  };

  const iterationSteps = {
    x: data.map(item => item.X),
    y: data.map(item => item.fx),
    mode: 'markers+lines',
    name: 'Newton-Raphson Iteration',
    marker: { color: 'red', size: 8 },
    line: { dash: 'dashdot', color: 'red' },
  };

  const cobwebLines = data.slice(0, -1).map((item, index) => {
    const nextItem = data[index + 1];
    const verticalLine = {
      x: [item.X, item.X],
      y: [item.X, item.fx],
      showlegend: false,
      mode: 'lines',
      line: { color: 'blue', dash: 'solid', width: 0.9 },
      name: 'Newton Step',
    };
    const horizontalLine = {
      x: [item.X, nextItem.X],
      y: [item.fx, item.fx],
      showlegend: false,
      mode: 'lines',
      line: { color: 'blue', dash: 'solid', width: 0.9 },
      name: 'Newton Step',
    };

    return [verticalLine, horizontalLine];
  }).flat();


  const layout = {
    title: 'Newton-Raphson Iteration Graph',
    xaxis: { title: 'X values', range: [Math.min(...xValues), Math.max(...xValues)] },
    yaxis: { title: 'f(x)', range: [Math.min(...generateFX(xValues)) * 1.1, Math.max(...generateFX(xValues)) * 1.1] },
    dragmode: 'pan',
    legend: {
      orientation: 'h',
      x: 0,
      y: 4,
    },
  };

  return (
    <div className="flex justify-center flex-col">
      <h3 className="text-center text-xl mt-10 mb">Newton-Raphson Iteration Graph</h3>
      <div className="sm:w-1/2 md:w-max lg:w-max h-max">
        <Plot
          data={[functionFX, yEqualsXLine, iterationSteps, ...cobwebLines]}
          layout={layout}
          config={{ scrollZoom: true }}
          className="sm:w-1/4vh md:w-max lg:w-max h-max"
        />
      </div>
    </div>
  );
};

export default NewtonRhapsonGraph;
