import { useState, useEffect, useRef } from 'react';
import MatrixInput from './Component/Elements/MatrixInput';
import MathEquation from './Component/Elements/MathEquation';
import 'katex/dist/katex.min.css';

const LU_Decomposition = () => {
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
      prevDimensionRef.current = dimension;
    }
  }, [dimension]);

  const formatMatrix = (matrix) => {
    return matrix.map(row => 
      row.map(val => typeof val === 'number' ? val.toFixed(4) : val).join(' & ')
    ).join('\\\\');
  };

  const solve = () => {
    let steps = [];
    const n = dimension;

    let A = matrixA.map(row => [...row.map(Number)]);
    let b = matrixB.map(row => Number(row[0]));
    let L = Array(n).fill().map(() => Array(n).fill(0));
    let U = Array(n).fill().map(() => Array(n).fill(0));
    
    steps.push({
      explanation: 'Initial Matrix A:',
      latex: `A = \\begin{bmatrix} ${formatMatrix(A)} \\end{bmatrix}`
    });

    for (let i = 0; i < n; i++) {
      for (let k = i; k < n; k++) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
          sum += L[i][j] * U[j][k];
        }
        U[i][k] = A[i][k] - sum;
      }
      
      L[i][i] = 1;
      for (let k = i + 1; k < n; k++) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
          sum += L[k][j] * U[j][i];
        }
        L[k][i] = (A[k][i] - sum) / U[i][i];
      }
      
      steps.push({
        explanation: `Step ${i + 1}: Computed row ${i + 1} of L and U:`,
        latex: `L = \\begin{bmatrix} ${formatMatrix(L)} \\end{bmatrix} \\\\ U = \\begin{bmatrix} ${formatMatrix(U)} \\end{bmatrix}`
      });
    }
    
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
    
    // Backward substitution (Ux = y)
    let x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += U[i][j] * x[j];
      }
      x[i] = (y[i] - sum) / U[i][i];
    }
    
    steps.push({
      explanation: 'Backward Substitution (Ux = y):',
      latex: `x = \\begin{bmatrix} ${x.map(val => val.toFixed(4)).join('\\\\')} \\end{bmatrix}`
    });

    setSteps(steps);
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-center text-5xl mb-10">LU Decomposition Solver</h2>
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

export default LU_Decomposition;