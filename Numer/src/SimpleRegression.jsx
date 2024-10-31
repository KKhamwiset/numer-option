import { useState } from "react";
import 'katex/dist/katex.min.css';

const SimpleRegression = () => {
    const [numberOfPoints, setNumberOfPoints] = useState(3);
    const [xValue, setXValue] = useState(0);
    const [points, setPoints] = useState(Array(3).fill().map(() => ({ x: '', y: '' })));
    const [matrixOutput, setMatrixOutput] = useState([]);
    const [result, setResult] = useState(null);
    const [mOrder, setMOrder] = useState(1);
    const [selectedPoints, setSelectedPoints] = useState(Array(3).fill(false));
    const [steps, setSteps] = useState([]);

    const handlePointsChange = (value) => {
        const newValue = Math.max(1, value);
        setNumberOfPoints(newValue);
        setPoints(Array(newValue).fill().map((_, i) => 
            points[i] || { x: '', y: '' }
        ));
        setSelectedPoints(Array(newValue).fill(false));
    };

    const calculateRegression = (validPoints, order) => {
        const n = validPoints.length;
        const matrix = Array(order + 1).fill().map(() => Array(order + 2).fill(0));
        for (let i = 0; i <= order; i++) {
            for (let j = 0; j <= order; j++) {
                let sum = 0;
                for (let k = 0; k < n; k++) {
                    sum += Math.pow(validPoints[k].x, i + j);
                }
                matrix[i][j] = sum;
            }
            
            let sum = 0;
            for (let k = 0; k < n; k++) {
                sum += validPoints[k].y * Math.pow(validPoints[k].x, i);
            }
            matrix[i][order + 1] = sum;
        }
        console.log(matrix);
        setMatrixOutput(matrix);
        return gaussJordanElimination(matrix);
    };
    const formatMatrix = (matrix, vector) => {
        const augmented = matrix.map((row, i) => [...row, vector[i][0]]);
        return augmented.map(row => row.map(val => 
          typeof val === 'number' ? val.toFixed(4) : val
        ).join(' & ')).join('\\\\');
      };
    const gaussJordanElimination = (matrix) => {
        const n = matrix.length;
        const c = matrix[0].length;
        for (let current = 0; current < n; current++) {
            const pivot = matrix[current][current];
            for (let j = 0; j < c; j++) {
                matrix[current][j] /= pivot;
            }
            for (let i = 0; i < n; i++) {
                if (i !== current) {
                    const factor = matrix[i][current];
                    for (let j = 0; j < c; j++) {
                        matrix[i][j] -= factor * matrix[current][j];
                    }
                }
            }
        }
    
        // Back substitution
        for (let current = n - 1; current >= 0; current--) {
            for (let i = current - 1; i >= 0; i--) {
                const factor = matrix[i][current];
                for (let j = c - 1; j >= 0; j--) {
                    matrix[i][j] -= factor * matrix[current][j];
                }
            }
        }
    
        return matrix;
    };

    const generateEquationString = (coefficients) => {
        return coefficients.map((coef, index) => {
            if (index === 0) return coef.toFixed(4);
            if (index === 1) return `${coef.toFixed(4)}x`;
            return `${coef.toFixed(4)}x^${index}`;
        }).join(' + ');
    };

    const calculateYValue = (x, coefficients) => {
        return coefficients.reduce((sum, coef, index) => sum + coef * Math.pow(x, index), 0);
    };

    const handleCalculate = () => {
        const validPoints = points.filter((point, index) => 
            selectedPoints[index] && 
            point.x !== '' && 
            point.y !== '' &&
            !isNaN(point.x) && 
            !isNaN(point.y)
        ).map(point => ({
            x: parseFloat(point.x),
            y: parseFloat(point.y)
        }));

        if (validPoints.length < mOrder + 1) {
            alert(`Need at least ${mOrder + 1} points for ${mOrder} order regression`);
            return;
        }
        console.log(validPoints);
        
    };

    const toggleAll = () => {
        const allSelected = selectedPoints.every(Boolean);
        setSelectedPoints(Array(numberOfPoints).fill(!allSelected));
    };

    return (
        <div className="flex flex-col items-center mt-8 max-w-2xl mx-auto p-4">
            <div className="text-center text-5xl mb-10">Simple Regression</div>
            
            <div className="w-full bg-white rounded-lg shadow-md p-6 border border-black">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Number of points</span>
                        <button 
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            onClick={() => handlePointsChange(numberOfPoints - 1)}
                        >
                            -
                        </button>
                        <span className="mx-2">{numberOfPoints}</span>
                        <button 
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            onClick={() => handlePointsChange(numberOfPoints + 1)}
                        >
                            +
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">M order</span>
                        <input  
                            type="number"
                            value={mOrder}
                            onChange={(e) => setMOrder(parseInt(e.target.value))}
                            min="1"
                            max={numberOfPoints - 1}
                            className="w-24 px-3 py-2 border rounded focus:outline-none bg-white focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="font-medium">X value</span>
                        <input
                            type="number"
                            value={xValue}
                            onChange={(e) => setXValue(e.target.value)}
                            className="w-24 px-3 py-2 border rounded focus:outline-none bg-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button 
                        className="px-4 py-2 bg-black text-white rounded hover:bg-orange-500 hover:text-black transition-colors"
                        onClick={handleCalculate}
                    >
                        Calculate
                    </button>
                </div>

                <div className="space-y-2">
                    {points.map((point, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <input
                                type="checkbox"
                                checked={selectedPoints[index]}
                                onChange={(e) => {
                                    const newSelected = [...selectedPoints];
                                    newSelected[index] = e.target.checked;
                                    setSelectedPoints(newSelected);
                                }}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="w-8">{index + 1}.</span>
                            <input
                                placeholder={`x${index}`}
                                value={point.x}
                                onChange={(e) => {
                                    const newPoints = [...points];
                                    newPoints[index] = { ...point, x: e.target.value };
                                    setPoints(newPoints);
                                }}
                                className="w-32 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                placeholder={`f(x${index})`}
                                value={point.y}
                                onChange={(e) => {
                                    const newPoints = [...points];
                                    newPoints[index] = { ...point, y: e.target.value };
                                    setPoints(newPoints);
                                }}
                                className="w-32 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                </div>
                <button 
                    className="px-4 my-5 bg-black text-white rounded hover:bg-orange-500 hover:text-black transition-colors"
                    onClick={toggleAll}
                >
                    Toggle all
                </button>
            </div>
        </div>
    );
};

export default SimpleRegression;