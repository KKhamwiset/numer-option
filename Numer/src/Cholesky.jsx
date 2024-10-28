import { useState, useEffect, useRef } from 'react';
import MatrixInput from './Component/Elements/MatrixInput';
import MathEquation from './Component/Elements/MathEquation';
import 'katex/dist/katex.min.css';

const CholeskyDecomposition = () => {
  const [dimension, setDimension] = useState(3);
  const [matrixA, setMatrixA] = useState(Array.from({ length: dimension }, () => Array(dimension).fill('')));
  const [matrixB, setMatrixB] = useState(Array.from({ length: dimension }, () => Array(1).fill('')));
  const [matrixX, setMatrixX] = useState(Array.from({ length: dimension }, () => Array(1).fill('')));
  const [steps, setSteps] = useState([]);
  const prevDimensionRef = useRef(dimension);

  useEffect(() => {
    if (dimension !== prevDimensionRef.current) {
      setMatrixA(Array.from({ length: dimension }, () => Array(dimension).fill('')));
      setMatrixB(Array.from({ length: dimension }, () => Array(1).fill('')));
      setMatrixX(Array.from({ length: dimension }, () => Array(1).fill('')));
      prevDimensionRef.current = dimension;
    }
  }, [dimension]);

  const formatMatrix = (matrix) => {
    return matrix.map(row => 
      row.map(val => typeof val === 'number' ? val.toFixed(4) : val).join(' & ')
    ).join('\\\\');
  };

  const isSymmetric = (matrix) => {
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (Math.abs(matrix[i][j] - matrix[j][i]) > 1e-10) {
          return false;
        }
      }
    }
    return true;
  };

  const solve = () => {
    let steps = [];
    const n = dimension;
    
    // Convert input matrices to numbers
    let A = matrixA.map(row => [...row.map(Number)]);
    let b = matrixB.map(row => Number(row[0]));
    
    // Check if matrix is symmetric
    if (!isSymmetric(A)) {
      steps.push({
        explanation: 'Error:',
        latex: '\\text{Matrix must be symmetric for Cholesky decomposition}'
      });
      setSteps(steps);
      return;
    }

    steps.push({
      explanation: 'Initial Matrix A:',
      latex: `A = \\begin{bmatrix} ${formatMatrix(A)} \\end{bmatrix}`
    });
    let L = Array(n).fill().map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = 0;

        if (j === i) {
          for (let k = 0; k < j; k++) {
            sum += Math.pow(L[j][k], 2);
          }
          const value = A[j][j] - sum;
          if (value <= 0) {
            steps.push({
              explanation: 'Error:',
              latex: '\\text{Matrix is not positive definite}'
            });
            setSteps(steps);
            return;
          }
          L[j][j] = Math.sqrt(value);
        } else {
          for (let k = 0; k < j; k++) {
            sum += L[i][k] * L[j][k];
          }
          L[i][j] = (A[i][j] - sum) / L[j][j];
        }

        steps.push({
          explanation: `Computing L[${i+1}][${j+1}]:`,
          latex: `L = \\begin{bmatrix} ${formatMatrix(L)} \\end{bmatrix}`
        });
      }
    }
    let Lt = L.map((row, i) => row.map((val, j) => L[j][i]));
    
    steps.push({
      explanation: 'Final L and L^T matrices:',
      latex: `L = \\begin{bmatrix} ${formatMatrix(L)} \\end{bmatrix} \\\\ L^T = \\begin{bmatrix} ${formatMatrix(Lt)} \\end{bmatrix}`
    });

    // Forward substitution (Ly = b)
    let y = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += L[i][j] * y[j];
      }
      y[i] = (b[i] - sum) / L[i][i];
    }
    
    steps.push({
      explanation: 'Forward Substitution (Ly = b):',
      latex: `y = \\begin{bmatrix} ${y.map(val => val.toFixed(4)).join('\\\\')} \\end{bmatrix}`
    });

    // Backward substitution (L^T x = y)
    let x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += Lt[i][j] * x[j];
      }
      x[i] = (y[i] - sum) / Lt[i][i];
    }

    steps.push({
      explanation: 'Backward Substitution (L^T x = y):',
      latex: `x = \\begin{bmatrix} ${x.map(val => val.toFixed(4)).join('\\\\')} \\end{bmatrix}`
    });

    setSteps(steps);
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-center text-5xl mb-10">Cholesky Decomposition Solver</h2>
      <div className="flex flex-col items-center mb-4 rounded-lg border-black border-2 p-10 mt-auto justify-center">
        <div className="flex flex-col justify-center items-center">
          <label className="mb-1">Matrix Dimension (n × n):</label>
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
            <MathEquation equation="\{x\}" />
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
              <MathEquation equation="\{B\}" />
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

export default CholeskyDecomposition;