import { useState, useEffect, useRef } from 'react';
import MatrixInput from './Component/Elements/MatrixInput';
import MathEquation from './Component/Elements/MathEquation';
import 'katex/dist/katex.min.css';

const JacobiMethod = () => {
  const [dimension, setDimension] = useState(3);
  const [matrixA, setMatrixA] = useState(Array.from({ length: dimension }, () => Array(dimension).fill('')));
  const [matrixB, setMatrixB] = useState(Array.from({ length: dimension }, () => Array(1).fill('')));
  const [matrixX, setMatrixX] = useState(Array.from({ length: dimension }, () => Array(1).fill('')));
  const [initialGuess, setInitialGuess] = useState(Array.from({ length: 1 }, () => Array(dimension).fill('')));
  const [epsilon, setEpsilon] = useState(0.000001);
  const [maxIterations, setMaxIterations] = useState(100);
  const [steps, setSteps] = useState([]);
  const prevDimensionRef = useRef(dimension);

  useEffect(() => {
    if (dimension !== prevDimensionRef.current) {
      setMatrixA(Array.from({ length: dimension }, () => Array(dimension).fill('')));
      setMatrixB(Array.from({ length: dimension }, () => Array(1).fill('')));
      setMatrixX(Array.from({ length: dimension }, () => Array(1).fill('')));
      setInitialGuess(Array.from({ length: 1 }, () => Array(dimension).fill('')));
      prevDimensionRef.current = dimension;
    }
  }, [dimension]);

  const formatMatrix = (matrix) => {
    return matrix.map(row => 
      row.map(val => typeof val === 'number' ? val.toFixed(6) : val).join(' & ')
    ).join('\\\\');
  };

  const formatVector = (vector) => {
    return vector.map(val => val.toFixed(6)).join('\\\\');
  };

  const isDiagonallyDominant = (matrix) => {
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
      let diagonalValue = Math.abs(matrix[i][i]);
      let sumOthers = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          sumOthers += Math.abs(matrix[i][j]);
        }
      }
      if (diagonalValue <= sumOthers) {
        return false;
      }
    }
    return true;
  };

  const calculateError = (oldX, newX) => {
    return Math.max(...oldX.map((val, i) => Math.abs(val - newX[i])));
  };

    const solve = () => {
      let steps = [];
      const n = dimension;
      
      let A = matrixA.map(row => [...row.map(Number)]);
      let b = matrixB.map(row => Number(row[0]));
      let x = initialGuess[0].map(Number);
      
      if (!isDiagonallyDominant(A)) {
          steps.push({
              explanation: 'Warning:',
              latex: '\\text{Matrix is not strictly diagonally dominant. Convergence is not guaranteed.}'
          });
      }

      steps.push({
          explanation: 'Initial System:',
          latex: `A = \\begin{bmatrix} ${formatMatrix(A)} \\end{bmatrix}, \\quad b = \\begin{bmatrix} ${formatVector(b)} \\end{bmatrix}`
      });

      steps.push({
          explanation: 'Initial Guess X⁰:',
          latex: `x^{(0)} = \\begin{bmatrix} ${x.join(' & ')} \\end{bmatrix}`
      });

      let iteration = 0;
      let error = Infinity;

      while (error > epsilon && iteration < maxIterations) {
          let xNew = Array(n).fill(0);
          
          for (let i = 0; i < n; i++) {
              let sum = 0;
              for (let j = 0; j < n; j++) {
                  if (j !== i) {
                      sum += A[i][j] * x[j];
                  }
              }
              xNew[i] = (b[i] - sum) / A[i][i];
          }

          error = calculateError(x, xNew);
          iteration++;
          steps.push({
              explanation: `Iteration ${iteration}:`,
              latex: `x^{(${iteration})} = \\begin{bmatrix} ${formatVector(xNew)} \\end{bmatrix} \\\\ \\text{Error} = ${error.toFixed(6)}`
          });

          x = [...xNew];
      }

      if (iteration === maxIterations) {
          steps.push({
              explanation: 'Note:',
              latex: '\\text{Maximum iterations reached. Solution may not have converged.}'
          });
      }

      // Display final solution as column vector
      steps.push({
          explanation: 'Final Solution:',
          latex: `x = \\begin{bmatrix} ${formatVector(x)} \\end{bmatrix}`
      });

      setSteps(steps);
      setMatrixX(x.map(val => [val])); // Convert solution to column format for display
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-center text-5xl mb-10">Jacobi Iterative Method</h2>
      <div className="flex flex-col items-center mb-4 rounded-lg border-black border-2 p-10 mt-auto justify-center">
        <div className="flex flex-col justify-center items-center gap-4">
          <div>
            <label className="mb-1">Matrix Dimension (n × n):</label>
            <input 
              type="number"
              value={dimension} 
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > 0) setDimension(value);
              }}
              className="rounded px-3 py-2 placeholder-gray-500 border ml-2"
              placeholder="Enter dimension" 
              min="2"
              required
            />
          </div>
          
          <div>
            <label className="mb-1">Tolerance (ε):</label>
            <input 
              type="number"
              value={epsilon} 
              onChange={(e) => setEpsilon(Number(e.target.value))}
              className="rounded px-3 py-2 placeholder-gray-500 border ml-2"
              placeholder="Enter tolerance"
              step="0.000001"
              required
            />
          </div>
          
          <div>
            <label className="mb-1">Max Iterations:</label>
            <input 
              type="number"
              value={maxIterations} 
              onChange={(e) => setMaxIterations(Number(e.target.value))}
              className="rounded px-3 py-2 placeholder-gray-500 border ml-2"
              placeholder="Enter max iterations"
              min="1"
              required
            />
          </div>
        </div>

        <div className="flex flex-row justify-center my-10">
          <div>
            <div className="flex flex-col justify-center items-center mx-1">
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
          <div className="flex flex-col justify-center items-center mx-2">
            <MathEquation equation="{\\x\\}" />
            <MatrixInput
              n={dimension}
              m={1}
              textlabel="x"
              initialMatrix={matrixX}
              disable={true}
            />
          </div>
          <div className="my-auto">
            <MathEquation equation="=" />
          </div>
          <div>
            <div className="flex flex-col justify-center items-center mx-2">
              <MathEquation equation="{\\B\\}" />
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

        <div className="flex flex-col justify-center items-center my-5">
          <MathEquation equation="{\\X\\}^0" />
          <MatrixInput
            n={1}
            m={dimension}
            textlabel="x0"
            initialMatrix={initialGuess}
            onMatrixChange={setInitialGuess}
            disable={false}
          />
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

export default JacobiMethod;