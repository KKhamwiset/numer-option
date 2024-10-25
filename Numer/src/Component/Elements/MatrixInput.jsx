import { useState, useEffect } from 'react';

const MatrixInput = ({ 
  n, 
  m, 
  textlabel, 
  doubleDigit, 
  disable, 
  initialMatrix, 
  onMatrixChange 
}) => {
  const [matrixValues, setMatrixValues] = useState(initialMatrix);
  useEffect(() => {
    const newMatrix = Array.from({ length: n }, (_, i) =>
      Array.from({ length: m }, (_, j) => matrixValues[i]?.[j] || '')
    );
    setMatrixValues(newMatrix);
  }, [n, m, initialMatrix]);

  const handleChange = (i, j, value) => {
    const updatedMatrix = matrixValues.map((row, ri) =>
      row.map((cell, ci) => (ri === i && ci === j ? value : cell))
    );
    setMatrixValues(updatedMatrix);
    onMatrixChange?.(updatedMatrix);
  };

  const inputStyles = `
    flex rounded-md border border-input px-3 py-10 text-sm
    ring-offset-background focus-visible:outline-none 
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
    disabled:cursor-not-allowed disabled:opacity-50 
    h-20 w-20 text-center placeholder:text-gray-300 bg-white
  `.trim();

  return (
    <div 
      className="grid mt-2 gap-2" 
      style={{
        gridTemplateRows: `repeat(${n}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${m}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: n }, (_, i) =>
        Array.from({ length: m }, (_, j) => (
          <input 
            key={`${i}-${j}`}
            type="text"
            value={matrixValues[i]?.[j] || ''} 
            placeholder={`${textlabel}${i + 1}${doubleDigit ? j + 1 : ''}`}
            className={inputStyles}
            disabled={disable}
            onChange={(e) => handleChange(i, j, e.target.value)} 
          />
        ))
      )}
    </div>
  );
};

export default MatrixInput;