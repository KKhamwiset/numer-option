import { useState, useEffect, useRef } from 'react';
import MatrixInput from './Component/Elements/MatrixInput';
import MathEquation from './Component/Elements/MathEquation';
import 'katex/dist/katex.min.css';

const GaussJordan = () => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [matrixA, setMatrixA] = useState(Array.from({ length: rows }, () => Array(cols).fill('')));
  const [matrixB, setMatrixB] = useState(Array.from({ length: rows }, () => Array(1).fill('')));
  const [matrixX, setMatrixX] = useState(Array.from({ length: cols }, () => Array(1).fill('')));
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState(null);
  const prevDimensionsRef = useRef({ rows, cols });

  useEffect(() => {
    if (rows !== prevDimensionsRef.current.rows || cols !== prevDimensionsRef.current.cols) {
      const newMatrixA = Array.from({ length: rows }, () => Array(cols).fill(''));
      const newMatrixB = Array.from({ length: rows }, () => Array(1).fill(''));
      const newMatrixX = Array.from({ length: cols }, () => Array(1).fill(''));
      setMatrixA(newMatrixA);
      setMatrixB(newMatrixB);
      setMatrixX(newMatrixX);
      prevDimensionsRef.current = { rows, cols };
    }
  }, [rows, cols]);

  const formatMatrix = (matrix, vector) => {
    const augmented = matrix.map((row, i) => [...row, vector[i][0]]);
    return augmented.map(row => row.map(val => 
      typeof val === 'number' ? val.toFixed(4) : val
    ).join(' & ')).join('\\\\');
  };

  const solve = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (matrixA[i][j] === '' || isNaN(matrixA[i][j])) {
          setError(`Invalid input at position (${i+1},${j+1}) in matrix A`);
          return;
        }
      }
      if (matrixB[i][0] === '' || isNaN(matrixB[i][0])) {
        setError(`Invalid input at position (${i+1}) in vector B`);
        return;
      }
    }

    setError(null);
    let steps = [];
    let matrix = matrixA.map(row => [...row].map(Number));
    let vector = matrixB.map(row => [...row].map(Number));
    
    steps.push({
      explanation: 'Initial Augmented Matrix [A|b]:',
      latex: `\\begin{bmatrix} ${formatMatrix(matrix, vector)} \\end{bmatrix}`
    });

    const minDim = Math.min(rows, cols);
    for (let i = 0; i < minDim; i++) {
      const pivot = matrix[i][i];
      if (Math.abs(pivot) < 1e-10) {
        setError(`Error: Zero pivot encountered at position (${i+1},${i+1})`);
        return;
      }
      const pivotMultiplier = 1 / pivot;
      for (let j = i; j < cols; j++) {
        matrix[i][j] *= pivotMultiplier;
      }
      vector[i][0] *= pivotMultiplier;
      steps.push({
        explanation: `Normalize R${i+1}:`,
        latex: `R_{${i+1}} \\rightarrow \\frac{1}{${pivot.toFixed(4)}}R_{${i+1}}`
      });
      steps.push({
        explanation: 'After normalization:',
        latex: `\\begin{bmatrix} ${formatMatrix(matrix, vector)} \\end{bmatrix}`
      });
      for (let k = 0; k < rows; k++) {
        if (k !== i) {
          const factor = -matrix[k][i];
          if (Math.abs(factor) > 1e-10) {
            steps.push({
              explanation: `Eliminate in R${k+1}:`,
              latex: `R_{${k+1}} \\rightarrow R_{${k+1}} + (${factor.toFixed(4)})R_{${i+1}}`
            });

            for (let j = i; j < cols; j++) {
              matrix[k][j] += factor * matrix[i][j];
            }
            vector[k][0] += factor * vector[i][0];

            steps.push({
              explanation: 'After elimination:',
              latex: `\\begin{bmatrix} ${formatMatrix(matrix, vector)} \\end{bmatrix}`
            });
          }
        }
      }
    }

    if (rows > cols) {
      for (let i = cols; i < rows; i++) {
        if (Math.abs(vector[i][0]) > 1e-10) {
          setError("System is inconsistent (no solution exists)");
          return;
        }
      }
    }

    const solution = new Array(cols).fill(0);
    for (let i = 0; i < minDim; i++) {
      solution[i] = vector[i][0];
    }

    steps.push({
      explanation: 'Final Solution:',
      latex: `\\therefore \\begin{cases} 
        ${solution.map((val, i) => `x_{${i+1}} = ${val.toFixed(4)}`).join(' \\\\ ')}
        \\end{cases}`
    });

    setSteps(steps);
    setMatrixX(solution.map(x => [x]));
};
  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-center text-5xl mb-10">Gauss-Jordan Elimination</h2>
      <div className="flex flex-col items-center mb-4 rounded-lg border-black border-2 p-10 mt-auto justify-center">
        <div className='flex flex-row justify-center items-center gap-4'>
          <div className='flex flex-col justify-center items-center'>
            <label className="mb-1">Number of Rows:</label>
            <input 
              type="number"
              value={rows} 
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > 0) setRows(value);
              }}
              className="rounded px-3 py-2 placeholder-gray-500 border"
              placeholder="Enter rows" 
              min="2"
              required
            />
          </div>
          <div className='flex flex-col justify-center items-center'>
            <label className="mb-1">Number of Columns:</label>
            <input 
              type="number"
              value={cols} 
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > 0) setCols(value);
              }}
              className="rounded px-3 py-2 placeholder-gray-500 border"
              placeholder="Enter columns" 
              min="2"
              required
            />
          </div>
        </div>

        <div className="flex flex-row justify-center my-10">
          <div>
            <div className='flex flex-col justify-center items-center mx-1'>
              <MathEquation equation="[A]" />
              <MatrixInput
                n={rows}
                m={cols}
                textlabel="a"
                doubleDigit={true}
                disable={false}
                initialMatrix={matrixA}
                onMatrixChange={setMatrixA}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center mx-2">
            <MathEquation equation="\{x\}" />
            <MatrixInput
              n={cols}
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
              <MathEquation equation="\{B\}" />
              <MatrixInput
                n={rows}
                m={1}
                textlabel="b"
                initialMatrix={matrixB}
                onMatrixChange={setMatrixB}
                disable={false}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <button 
          onClick={solve}
          className="btn-primary text-white mb-5 mt-5 hover:scale-105  
          transition ease-out duration-200 hover:bg-orange-500 hover:text-black"
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

export default GaussJordan;