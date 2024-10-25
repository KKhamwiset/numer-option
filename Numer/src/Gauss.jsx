import { useState, useEffect, useRef } from 'react';
import MatrixInput from './Component/Elements/MatrixInput';
import MathEquation from './Component/Elements/MathEquation';
import 'katex/dist/katex.min.css';

const Gauss = () => {
  const [dimension, setDimension] = useState(3);
  const [matrixA, setMatrixA] = useState(Array.from({ length: dimension }, () => Array(dimension).fill('')));
  const [matrixB, setMatrixB] = useState(Array.from({ length: dimension }, () => Array(1).fill('')));
  const [matrixX, setMatrixX] = useState(Array.from({ length: dimension }, () => Array(1).fill('')));
  const [steps, setSteps] = useState([]);
  const prevDimensionRef = useRef(dimension);

  useEffect(() => {
    if (dimension !== prevDimensionRef.current) {
      const newMatrixA = Array.from({ length: dimension }, () => Array(dimension).fill(''));
      const newMatrixB = Array.from({ length: dimension }, () => Array(1).fill(''));
      const newMatrixX = Array.from({ length: dimension }, () => Array(1).fill(''));
      setMatrixA(newMatrixA);
      setMatrixB(newMatrixB);
      setMatrixX(newMatrixX);
      prevDimensionRef.current = dimension;
    }
  }, [dimension]);

  const formatMatrix = (matrix, vector) => {
    const augmented = matrix.map((row, i) => [...row, vector[i][0]]);
    return augmented.map(row => row.map(val => 
      typeof val === 'number' ? val.toFixed(4) : val
    ).join(' & ')).join('\\\\');
  };

  const solve = () => {
    let steps = [];
    let matrix = matrixA.map(row => [...row].map(Number));
    let vector = matrixB.map(row => [...row].map(Number));
    
    steps.push({
      explanation: 'Initial Augmented Matrix [A|b]:',
      latex: `\\begin{bmatrix} ${formatMatrix(matrix, vector)} \\end{bmatrix}`
    });

    for (let i = 0; i < dimension - 1; i++) {
      const pivot = matrix[i][i];
      steps.push({
        explanation: `Pivot element a_{${i+1}${i+1}} = ${pivot}`,
        latex: `\\text{Using row } R_{${i+1}} \\text{ as pivot row}`
      });

      for (let k = i + 1; k < dimension; k++) {
        const factor = -matrix[k][i] / pivot;
        if (factor !== 0) {
          steps.push({
            explanation: `Eliminate a_{${k+1}${i+1}}:`,
            latex: `R_{${k+1}} \\rightarrow R_{${k+1}} + (${factor.toFixed(4)})R_{${i+1}}`
          });

          for (let j = i; j < dimension; j++) {
            matrix[k][j] += factor * matrix[i][j];
          }
          vector[k][0] += factor * vector[i][0];

          steps.push({
            explanation: 'Resulting matrix:',
            latex: `\\begin{bmatrix} ${formatMatrix(matrix, vector)} \\end{bmatrix}`
          });
        }
      }
    }

    const solution = new Array(dimension).fill(0);
    steps.push({
      explanation: 'Back Substitution:',
      latex: '\\text{Solve equations from bottom to top}'
    });

    for (let i = dimension - 1; i >= 0; i--) {
      let sum = 0;
      let equation = [];
      for (let j = i + 1; j < dimension; j++) {
        if (matrix[i][j] !== 0) {
          sum += matrix[i][j] * solution[j];
          equation.push(`(${matrix[i][j].toFixed(4)})(${solution[j].toFixed(4)})`);
        }
      }
      
      solution[i] = (vector[i][0] - sum) / matrix[i][i];
      
      const equationLatex = equation.length > 0 
        ? `x_{${i+1}} = \\frac{${vector[i][0].toFixed(4)} - (${equation.join(' + ')})}{${matrix[i][i].toFixed(4)}} = ${solution[i].toFixed(4)}`
        : `x_{${i+1}} = \\frac{${vector[i][0].toFixed(4)}}{${matrix[i][i].toFixed(4)}} = ${solution[i].toFixed(4)}`;
      
      steps.push({
        explanation: `Solve for x_{${i+1}}:`,
        latex: equationLatex
      });
    }

    steps.push({
      explanation: 'Final Solution:',
      latex: `\\therefore (x_1, x_2, ${dimension > 2 ? 'x_3' : ''}) = (${solution.map(x => x.toFixed(4)).join(', ')})`
    });

    setSteps(steps);
    setAnswer(`Solution: (${solution.map(x => x.toFixed(4)).join(', ')})`);
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-center text-5xl mb-10">Gauss Elimination</h2>
      <div className="flex flex-col items-center mb-4 rounded-lg border-black border-2 p-10 mt-auto justify-center">
        <div className='flex flex-col justify-center items-center'>
          <label className="mb-1">Enter Matrix's Dimension (n × n):</label>
          <input 
            type="number"
            value={dimension} 
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value > 0) setDimension(value);
            }}
            className="rounded px-3 py-2 placeholder-gray-500 border"
            placeholder="Enter dimension" 
            min="2"
            required
          />
        </div>

        <div className="flex flex-row justify-center my-10">
          <div>
            <div className='flex flex-col justify-center items-center mx-1'>
              <MathEquation equation="[A]" />
              <MatrixInput
                n={dimension}
                m={dimension}
                textlabel="a"
                doubleDigit={true}
                disable={false}
                initialMatrix={matrixA}
                onMatrixChange={setMatrixA}
              />
            </div>
          </div>
          <div>
            <div className='flex flex-col justify-center items-center mx-2'>
              <MathEquation equation="\\{x\\}" />
              <MatrixInput
                n={dimension}
                m={1}
                textlabel="x"
                initialMatrix={matrixX}
                onMatrixChange={setMatrixX}
                disable={true}
              />
            </div>
          </div>
          <div className="my-auto">
            <MathEquation equation="=" />
          </div>
          <div>
            <div className='flex flex-col justify-center items-center mx-2'>
              <MathEquation equation="\\{B\\}" />
              <MatrixInput
                n={dimension}
                m={1}
                textlabel="b"
                initialMatrix={matrixB}
                onMatrixChange={setMatrixB}
                disable={false}
              />
            </div>
          </div>
        </div>

        <button 
          onClick={solve}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Solve
        </button>

        {steps.length > 0 && (
          <div className="mt-10 w-full max-w-4xl">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Step-by-Step Solution:</h3>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <p className="font-semibold text-gray-700 mb-2">{step.explanation}</p>
                    <div className="overflow-x-auto">
                      <MathEquation equation={step.latex} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gauss;