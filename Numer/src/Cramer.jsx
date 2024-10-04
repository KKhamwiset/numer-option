import { useState, useEffect, useRef } from 'react';
import MatrixInput from './Component/Elements/MatrixGridInput';
import MathEquation from './Component/Elements/MathEquation';
import { evaluate } from 'mathjs';
import 'katex/dist/katex.min.css';

const Cramer = () => {
  const [dimension, setDimension] = useState(3);
  const [matrixA, setMatrixA] = useState(Array.from({ length: dimension }, () => Array(dimension).fill('')));
  const [matrixB, setMatrixB] = useState(Array.from({ length: dimension }, () => Array(1).fill('')));
  const [matrixX, setMatrixX] = useState(Array.from({ length: dimension }, () => Array(1).fill('')));
  const [latexOutput, setLatexOutput] = useState('');
  const [xResult, setXResult] = useState('');
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

  const exportInput = () => {
    const aMatrixLatex = matrixA.map(row => `${row.join(' & ')}`).join('\\\\');
    const bMatrixLatex = matrixB.map(row => `${row.join(' & ')}`).join('\\\\');
    const latex = `\\text{Matrix A: } \\begin{bmatrix} ${aMatrixLatex} \\end{bmatrix} \\\\ \\text{Matrix B: } \\begin{bmatrix} ${bMatrixLatex} \\end{bmatrix}`;
    setLatexOutput(latex);
  };

  const calculateDeterminant = (matrix) => {
    const determinant = evaluate(`det([${matrix.map(row => `[${row.join(',')}]`).join(',')}])`);
    console.log('Calculated Determinant:', determinant);
    return determinant;
  };

  const solve = () => {
    console.log('Matrix A:', matrixA);
    console.log('Matrix B:', matrixB);

    const detA = calculateDeterminant(matrixA);
    console.log('Determinant of Matrix A:', detA);

    if (detA === 0) {
      alert("The system has no unique solution (det(A) = 0)");
      return;
    }

    const results = matrixA.map((_, colIndex) => {
      const modifiedMatrix = matrixA.map((row, rowIndex) => {
        const newRow = [...row];
        newRow[colIndex] = matrixB[rowIndex][0];
        return newRow;
      });

      const detAi = calculateDeterminant(modifiedMatrix);
      return (detAi / detA).toFixed(2);
    });
    console.log(results);
    setXResult(results.map((x, index) => `x_${index + 1} = ${x}`).join(', '));
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-center text-5xl mb-10">Cramer's Rule</h2>
      <div className="flex flex-col items-center mb-4 rounded-lg border-black border-2 p-10 mt-auto justify-center">
        <div className='flex flex-col justify-center items-center'>
          <label className="mb-1">Enter Matrix's Dimension (<MathEquation equation={"n \\times n"}/>):</label>
          <input 
            id="dimen" 
            type="number"
            value={dimension} 
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value > 0) {
                setDimension(value);
              }
            }}
            className="rounded px-3 py-2 placeholder-gray-500 border"
            placeholder="Enter dimension of matrix" 
            required
          />
        </div>
        <div className="flex flex-row justify-center my-10">
          <div>
            <div className='flex flex-col justify-center items-center mx-1'>
              <MathEquation equation={"[A]"} />
              <MatrixInput
                n={dimension}
                m={dimension}
                textlabel="a"
                doubleDigit={true}
                disable={false}
                initialMatrix={matrixA}
                onMatrixChange={(updatedMatrix) => setMatrixA(updatedMatrix)}
              />
            </div>
          </div>
          <div>
            <div className='flex flex-col justify-center items-center mx-2'>
              <MathEquation equation={"\\{x\\}"} />
              <MatrixInput
                n={dimension}
                m={1}
                textlabel="x"
                initialMatrix={matrixX} 
                onMatrixChange={(updatedMatrix) => setMatrixX(updatedMatrix)} 
                disable={true}
              />
            </div>
          </div>
          <div className="my-auto"><MathEquation equation={"="} /></div>
          <div>
            <div className='flex flex-col justify-center items-center mx-2'>
              <MathEquation equation={"\\{B\\}"} />
              <MatrixInput
                n={dimension}
                m={1}
                textlabel="b"
                initialMatrix={matrixB} 
                onMatrixChange={(updatedMatrix) => setMatrixB(updatedMatrix)} 
                disable={false}
              />
            </div>
          </div>
        </div>
        <button 
          onClick={() => { 
            exportInput();
            solve();
          }} 
          className="`btn-primary text-white mb-5 mt-5 ${!isValidEquation ? 'opacity-50 cursor-not-allowed' : ''} hover:scale-105 
          transition ease-out duration-200 hover:bg-orange-500 hover:text-black`"
        >
          Solve
        </button>
        {latexOutput && (
          <div className="mt-10 flex flex-col">
            <MathEquation equation={latexOutput} className='m-5'/>
            <MathEquation equation={xResult}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cramer;
