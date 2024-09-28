import React from 'react';
import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const BisectionGraph = ({ data }) => {
  const chartData = {
    labels: data.map((element) => element.iteration),
    datasets: [
      {
        label: 'X Values',
        data: data.map((element) => element.Xm),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
      },
      {
        label: 'Error',
        data: data.map((element) => element.error),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bisection Method Graph',
      },
    },
  };

  return (
    <div>
      <h3 className="text-center text-xl">Bisection Method Graph</h3>
      <div className='flex justify-center w-full'>
          <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BisectionGraph;
