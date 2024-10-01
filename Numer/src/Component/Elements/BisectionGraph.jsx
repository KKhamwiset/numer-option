import Plot from 'react-plotly.js';

const BisectionGraph = ({ data }) => {
  const XM = {
    x: data.map(item => item.iteration), 
    y: data.map(item => item.Xm), 
    mode: 'lines+markers',
    name: 'XM values',
    marker: { color: 'cyan' },
  };

  const XL = {
    x: data.map(item => item.iteration),
    y: data.map(item => item.Xl),
    mode: 'lines+markers',
    name: 'XL values',
    marker: { color: 'blue' },
  };

  const XR = {
    x: data.map(item => item.iteration),
    y: data.map(item => item.Xr),
    mode: 'lines+markers',
    name: 'XR values',
    marker: { color: 'purple' },
  };

  const layout = {
    title: '',
    xaxis: { title: 'Iterations' },
    yaxis: { title: 'X-Values' },
    legend: {
      orientation: 'h',
      x: 0, 
      y: 1.1,
    },
  };
  const config = {
    scrollZoom : true,
  }
  return (
    <div className='flex justify-center flex-col'>
    <h3 className="text-center text-xl mt-10 mb">Bisection Method Graph</h3>
      <div className="sm:w-1/2 md:w-max lg:w-max h-max">
        <Plot
          data={[XL, XR, XM]}
          layout={layout}
          config={config}
          className="sm:w-1/4vh md:w-max lg:w-max h-max"
        />
      </div>
    </div>
  );
}

export default BisectionGraph;
