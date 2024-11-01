import { useState, useEffect, useRef } from 'react';
import MatrixInput from './Component/Elements/MatrixInput';
import MathEquation from './Component/Elements/MathEquation';
import 'katex/dist/katex.min.css';
import axios from 'axios'

const MatrixInverse = () => {
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

  const formatAugmentedMatrix = (left, right) => {
    return left.map((row, i) => 
      [...row.map(val => typeof val === 'number' ? val.toFixed(4) : val),
       '|',
       ...right[i].map(val => typeof val === 'number' ? val.toFixed(4) : val)
      ].join(' & ')
    ).join('\\\\');
  };

  const solve = () => {
    let steps = [];
    const n = dimension;
    
    let augmentedMatrix = matrixA.map(row => [...row.map(Number)]);
    let identityMatrix = Array(n).fill().map((_, i) => 
      Array(n).fill().map((_, j) => i === j ? 1 : 0)
    );
    
    steps.push({
      explanation: 'Initial Augmented Matrix [A|I]:',
      latex: `\\begin{bmatrix} ${formatAugmentedMatrix(augmentedMatrix, identityMatrix)} \\end{bmatrix}`
    });

    // Gauss-Jordan Elimination
    for (let i = 0; i < n; i++) {
      // Normalize current row
      const pivot = augmentedMatrix[i][i];
      if (Math.abs(pivot) < 1e-10) {
        steps.push({
          explanation: 'Error:',
          latex: '\\text{Matrix is not invertible (zero pivot encountered)}'
        });
        setSteps(steps);
        return;
      }

      // Divide the row by pivot
      const pivotMultiplier = 1 / pivot;
      for (let j = 0; j < n; j++) {
        augmentedMatrix[i][j] *= pivotMultiplier;
        identityMatrix[i][j] *= pivotMultiplier;
      }

      steps.push({
        explanation: `Normalize R_{${i+1}}:`,
        latex: `R_{${i+1}} \\rightarrow \\frac{1}{${pivot.toFixed(4)}}R_{${i+1}}`
      });
      steps.push({
        explanation: 'After normalization:',
        latex: `\\begin{bmatrix} ${formatAugmentedMatrix(augmentedMatrix, identityMatrix)} \\end{bmatrix}`
      });

      // Eliminate in all other rows
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = -augmentedMatrix[k][i];
          for (let j = 0; j < n; j++) {
            augmentedMatrix[k][j] += factor * augmentedMatrix[i][j];
            identityMatrix[k][j] += factor * identityMatrix[i][j];
          }

          if (factor !== 0) {
            steps.push({
              explanation: `Eliminate in R_{${k+1}}:`,
              latex: `R_{${k+1}} \\rightarrow R_{${k+1}} + (${factor.toFixed(4)})R_{${i+1}}`
            });
            steps.push({
              explanation: 'Current matrix:',
              latex: `\\begin{bmatrix} ${formatAugmentedMatrix(augmentedMatrix, identityMatrix)} \\end{bmatrix}`
            });
          }
        }
      }
    }

    steps.push({
      explanation: 'Inverse Matrix A⁻¹:',
      latex: `A^{-1} = \\begin{bmatrix} ${formatMatrix(identityMatrix)} \\end{bmatrix}`
    });

    const solution = [];
    for (let i = 0; i < identityMatrix.length; i++) {
        let sum = 0;
        for (let j = 0; j < identityMatrix[i].length; j++) {
            sum += identityMatrix[i][j] * Number(matrixB[j][0]);
        }
        solution.push({ value: sum });
    }
    steps.push({
      explanation: 'Solution X = A⁻¹B:',
      latex: `X = A^{-1}B = \\begin{bmatrix} ${solution.map(x => x.value.toFixed(4)).join('\\\\')} \\end{bmatrix}`
    });
    const sendAPIRequest = () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      axios.post(`${apiUrl}/api/linearAlgebra`, {
        maintype : "LinearAlgebra",
        subtype: "Matrix Inversion",
        matrixA : JSON.stringify(augmentedMatrix),
        matrixB : JSON.stringify(matrixB),
        matrixX : JSON.stringify(solution)
      })
    }
    sendAPIRequest();
    setSteps(steps);
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-center text-5xl mb-10">Matrix Inversion (Gauss-Jordan)</h2>
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

export default MatrixInverse;
