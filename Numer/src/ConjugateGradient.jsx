import { useState, useEffect, useRef } from 'react';
import MatrixInput from './Component/Elements/MatrixInput';
import MathEquation from './Component/Elements/MathEquation';
import 'katex/dist/katex.min.css';

const ConjugateGradient = () => {
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

  const isPositiveDefinite = (matrix) => {
    return matrix.every((row, i) => matrix[i][i] > 0);
  };

  // Vector operations
  const dotProduct = (a, b) => {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  };

  const vectorAdd = (a, b) => {
    return a.map((val, i) => val + b[i]);
  };

  const vectorSubtract = (a, b) => {
    return a.map((val, i) => val - b[i]);
  };

  const vectorScale = (vector, scalar) => {
    return vector.map(val => val * scalar);
  };

  const matrixVectorMultiply = (matrix, vector) => {
    return matrix.map(row => dotProduct(row, vector));
  };

  const calculateResidualNorm = (A, x, b) => {
    const r = vectorSubtract(b, matrixVectorMultiply(A, x));
    return Math.sqrt(dotProduct(r, r));
  };

  const solve = () => {
    let steps = [];
    const n = dimension;
    
    // Convert input matrices to numbers
    let A = matrixA.map(row => [...row.map(Number)]);
    let b = matrixB.map(row => Number(row[0]));
    let x = initialGuess.map(row => Number(row[0]) || 0); // Use initial guess, default to 0 if empty
    
    // Check if matrix is symmetric
    if (!isSymmetric(A)) {
      steps.push({
        explanation: 'Error:',
        latex: '\\text{Matrix must be symmetric for Conjugate Gradient method}'
      });
      setSteps(steps);
      return;
    }

    // Check if matrix is positive definite
    if (!isPositiveDefinite(A)) {
      steps.push({
        explanation: 'Warning:',
        latex: '\\text{Matrix may not be positive definite. Algorithm may not converge.}'
      });
    }

    steps.push({
      explanation: 'Initial System:',
      latex: `A = \\begin{bmatrix} ${formatMatrix(A)} \\end{bmatrix} \\\\ b = \\begin{bmatrix} ${formatVector(b)} \\end{bmatrix}`
    });

    // Calculate initial residual using provided initial guess
    let r = vectorSubtract(b, matrixVectorMultiply(A, x));
    let p = [...r];
    let iteration = 0;

    const initialResidualNorm = Math.sqrt(dotProduct(r, r));
    steps.push({
      explanation: 'Initial Values:',
      latex: `x^{(0)} = \\begin{bmatrix} ${formatVector(x)} \\end{bmatrix} \\\\ r^{(0)} = b - Ax^{(0)} = \\begin{bmatrix} ${formatVector(r)} \\end{bmatrix} \\\\ \\|r^{(0)}\\| = ${initialResidualNorm.toFixed(6)} \\\\ p^{(0)} = r^{(0)}`
    });

    while (Math.sqrt(dotProduct(r, r)) > epsilon * initialResidualNorm && iteration < maxIterations) {
      // Compute α_k = (r_k^T r_k)/(p_k^T A p_k)
      const Ap = matrixVectorMultiply(A, p);
      const rTr = dotProduct(r, r);
      const alpha = rTr / dotProduct(p, Ap);
      
      // Update solution: x_{k+1} = x_k + α_k p_k
      const xNew = vectorAdd(x, vectorScale(p, alpha));
      
      // Update residual: r_{k+1} = r_k - α_k A p_k
      const rNew = vectorSubtract(r, vectorScale(Ap, alpha));
      
      // Compute β_k = (r_{k+1}^T r_{k+1})/(r_k^T r_k)
      const rNewTrNew = dotProduct(rNew, rNew);
      const beta = rNewTrNew / rTr;
      
      // Update search direction: p_{k+1} = r_{k+1} + β_k p_k
      const pNew = vectorAdd(rNew, vectorScale(p, beta));

      const currentError = Math.sqrt(rNewTrNew) / initialResidualNorm;

      steps.push({
        explanation: `Iteration ${iteration + 1}:`,
        latex: `\\alpha_{${iteration}} = ${alpha.toFixed(6)} \\\\ \\beta_{${iteration}} = ${beta.toFixed(6)} \\\\ x^{(${iteration + 1})} = \\begin{bmatrix} ${formatVector(xNew)} \\end{bmatrix} \\\\ \\text{Relative Error} = ${currentError.toFixed(6)}`
      });

      // Update for next iteration
      x = xNew;
      r = rNew;
      p = pNew;
      iteration++;
    }

    if (iteration === maxIterations) {
      steps.push({
        explanation: 'Warning:',
        latex: '\\text{Maximum iterations reached. Solution may not have converged fully.}'
      });
    }

    // Final solution and verification
    const finalResidualNorm = calculateResidualNorm(A, x, b);
    steps.push({
      explanation: 'Final Solution:',
      latex: `x = \\begin{bmatrix} ${formatVector(x)} \\end{bmatrix} \\\\ \\text{Final Residual Norm} = ${finalResidualNorm.toFixed(6)}`
    });

    setMatrixX(x.map(val => [val]));
    setSteps(steps);
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-center text-5xl mb-10">Conjugate Gradient Method</h2>
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

export default ConjugateGradient;