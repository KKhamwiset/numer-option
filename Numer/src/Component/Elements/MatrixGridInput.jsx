import { useState, useEffect } from 'react';

const MatrixInput = ({ n, m, textlabel, doubleDigit, disable, initialMatrix, onMatrixChange }) => {
  const [matrixValues, setMatrixValues] = useState(initialMatrix);
  useEffect(() => {
    const newMatrix = Array.from({ length: n }, (_, rowIndex) =>
      Array.from({ length: m }, (_, colIndex) => matrixValues[rowIndex]?.[colIndex] || '')
    );
    setMatrixValues(newMatrix);
  }, [n, m, initialMatrix]);

  const handleChange = (rowIndex, colIndex, value) => {
    const updatedMatrix = matrixValues.map((row, rIndex) =>
      row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? value : cell))
    );
    setMatrixValues(updatedMatrix);
    if (onMatrixChange) {
      onMatrixChange(updatedMatrix);
    }
  };
  return (
    <div 
      className="grid mt-2 gap-2" 
      style={{
        gridTemplateRows: `repeat(${n}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${m}, minmax(0, 1fr))`,
      }}
    >
      {matrixValues.map((row, rowIndex) => 
        row.map((value, colIndex) => (
          <input 
            key={`${rowIndex}-${colIndex}`}
            type="text"
            value={value} 
            placeholder={`${textlabel}${rowIndex + 1}${doubleDigit ? colIndex + 1 : ''}`}
            className="flex rounded-md border 
              border-input 
              px-3 py-10 
              text-sm 
              ring-offset-background 
              focus-visible:outline-none 
              focus-visible:ring-2 
              focus-visible:ring-ring 
              focus-visible:ring-offset-2 
              disabled:cursor-not-allowed 
              disabled:opacity-50 h-20 w-20 
              text-center 
              placeholder:text-gray-300 
              bg-white"
            disabled={disable}
            onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)} 
          />
        ))
      )}
    </div>
  );
};

export default MatrixInput;
