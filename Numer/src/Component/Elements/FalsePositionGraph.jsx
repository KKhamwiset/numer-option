import Plot from "react-plotly.js";

const FalsePositionGraph = ({ data, data2 }) => {
  const X = {
    x: data.map(item => item.C),  
    y: data.map(item => item.Fc), 
    mode: 'lines+markers',
    name: 'False-Position C values',
    marker: { color: 'cyan' },
  };

  const ActualFX = {
    x: data2.map(item => item.iteration), 
    y: data2.map(item => item.fx),
    mode: 'lines',
    name: 'Actual f(x) function',
    marker: { color: 'green' },
  };

  const layout = {
    title: 'False-Position Method vs Actual Function',
    xaxis: { title: 'X values' },
    yaxis: { title: 'Function Values (f(x))' },
    legend: {
      orientation: 'h',
      x: 0,
      y: 1.1,
    },
  };

  return (
    <div className="flex justify-center flex-col">
      <h3 className="text-center text-xl mt-10 mb">False-Position Method Graph</h3>
      <div className="sm:w-1/2 md:w-max lg:w-max h-max">
        <Plot
          data={[X, ActualFX]}
          layout={layout}
          config={{ scrollZoom: true }}
          className="sm:w-1/4vh md:w-max lg:w-max h-max"
        />
      </div>
    </div>
  );
};

export default FalsePositionGraph;
