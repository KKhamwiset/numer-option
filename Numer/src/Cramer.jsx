import { useState, useEffect, useRef } from 'react';
import MatrixInput from './Component/Elements/MatrixInput';
import MathEquation from './Component/Elements/MathEquation';
import { evaluate } from 'mathjs';
import 'katex/dist/katex.min.css';
import axios from 'axios';

const Cramer = () => {
  const [dimension, setDimension] = useState(3);
  const [matrixA, setMatrixA] = useState(Array.from({ length: dimension }, () => Array(dimension).fill('')));
  const [matrixB, setMatrixB] = useState(Array.from({ length: dimension }, () => Array(1).fill('')));
  const [matrixX, setMatrixX] = useState(Array.from({ length: dimension }, () => Array(1).fill('')));
  const [steps, setSteps] = useState([]);
  const prevDimensionRef = useRef(dimension);
  console.log(matrixA, matrixB, matrixX);
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

  const calculateDeterminant = (matrix) => {
    const determinant = evaluate(`det([${matrix.map(row => `[${row.join(',')}]`).join(',')}])`);
    return determinant;
  };

  const formatMatrix = (matrix) => {
    return matrix.map(row => row.join(' & ')).join('\\\\');
  };

  const solve = () => {
    let solutionSteps = [];
    
    const detA = calculateDeterminant(matrixA);
    solutionSteps.push({
      explanation: 'Original Matrix A:',
      latex: `det(A) = \\begin{vmatrix} ${formatMatrix(matrixA)} \\end{vmatrix} = ${detA}`
    });

    if (detA === 0) {
      solutionSteps.push({
        explanation: 'Error:',
        latex: '\\text{The system has no unique solution (det(A) = 0)}'
      });
      setSteps(solutionSteps);
      return;
    }

    const results = [];
    for (let i = 0; i < dimension; i++) {
      const modifiedMatrix = matrixA.map((row, rowIndex) => {
        const newRow = [...row];
        newRow[i] = matrixB[rowIndex][0];
        return newRow;
      });

      const detAi = calculateDeterminant(modifiedMatrix);
      const xi = (detAi / detA).toFixed(6);
      results.push(xi);

      solutionSteps.push({
        explanation: `Calculate x${i + 1}:`,
        latex: `x_{${i + 1}} = \\frac{det(A_{${i + 1}})}{det(A)} = \\frac{det(A_{${i + 1}}) = \\begin{vmatrix} ${formatMatrix(modifiedMatrix)} \\end{vmatrix}}{${detA}} = \\frac{${detAi}}{${detA}} = ${xi}`
      });
    }

    solutionSteps.push({
      explanation: 'Final Solution:',
      latex: `\\therefore (x_1, x_2, ${dimension > 2 ? 'x_3' : ''}) = (${results.map(x => x.toString()).join(', ')})`
    });
    
    const apiUrl = import.meta.env.VITE_API_URL;
    axios.post(`${apiUrl}/api/rootofEQ`, {
      subtype: 'Cramer',
      x_start: matrixA,
      x_end: matrixB,
      equation: 'Matrix',
      answer: results
      }
      .then((response) => {
          console.log(JSON.stringtify(response.data));
      })
      .catch((error) => {
          console.log(error);
      })
    );
    setSteps(solutionSteps);
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-center text-5xl mb-10">Cramer's Rule</h2>
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
              <h3 className="text-xl font-bold mb-4">Solution:</h3>
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

export default Cramer;