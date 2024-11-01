import { useState, useEffect, useRef } from 'react';
import MatrixInput from './Component/Elements/MatrixInput';
import MathEquation from './Component/Elements/MathEquation';
import 'katex/dist/katex.min.css';
import axios from 'axios';

const GaussJordan = () => {
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
 
    // Forward elimination
    for (let current = 0; current < dimension; current++) {
        const pivot = matrix[current][current];
        
        if (pivot === 0) {
            steps.push({
                explanation: 'Error:',
                latex: `\\text{Zero pivot encountered at position (${current+1},${current+1}). System may not have a unique solution.}`
            });
            return;
        }
 
        // Normalize current row
        for (let j = 0; j < dimension; j++) {
            matrix[current][j] /= pivot;
        }
        vector[current][0] /= pivot;
 
        steps.push({
            explanation: `Normalize R_{${current+1}}:`,
            latex: `R_{${current+1}} \\rightarrow \\frac{1}{${pivot.toFixed(4)}}R_{${current+1}}`
        });
 
        // Eliminate entries in current column
        for (let i = 0; i < dimension; i++) {
            if (i !== current) {
                const factor = matrix[i][current];
                for (let j = 0; j < dimension; j++) {
                    matrix[i][j] -= factor * matrix[current][j];
                }
                vector[i][0] -= factor * vector[current][0];
 
                steps.push({
                    explanation: `Eliminate in R_{${i+1}}:`,
                    latex: `R_{${i+1}} \\rightarrow R_{${i+1}} - (${factor.toFixed(4)})R_{${current+1}}`
                });
            }
        }
        
        steps.push({
            explanation: 'Current matrix:',
            latex: `\\begin{bmatrix} ${formatMatrix(matrix, vector)} \\end{bmatrix}`
        });
    }
 
    // Back substitution
    for (let current = dimension - 1; current >= 0; current--) {
        for (let i = current - 1; i >= 0; i--) {
            const factor = matrix[i][current];
            for (let j = dimension - 1; j >= 0; j--) {
                matrix[i][j] -= factor * matrix[current][j];
            }
            vector[i][0] -= factor * vector[current][0];
        }
    }
 
    steps.push({
        explanation: 'Final Solution:',
        latex: `\\therefore 
            \\\\${vector.map((val, i) => `x_{${i+1}} = ${val[0].toFixed(4)}`).join('\\\\')}
            \\\\`
    });
    const sendAPIRequest = () => {
      const apiUrl = import.meta.env.VITE_API_URL;
        axios.post(`${apiUrl}/api/linearAlgebra`, {
          maintype : 'LinearAlgebra',
          subtype: 'Gauss-Jordan Elimination',
          matrixA : JSON.stringify(matrixA),
          matrixB : JSON.stringify(matrixB),
          matrixX : JSON.stringify(vector),
        }).then((response) => {
          console.log(response.data);
        }).catch((error) => {
          console.log(error);
      })
    }
    sendAPIRequest();
    setSteps(steps);
 };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-center text-5xl mb-10">Gauss-Jordan Elimination</h2>
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

export default GaussJordan;