import { useState } from "react";
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const NewtonDivided = () => {
    const [numberOfPoints, setNumberOfPoints] = useState(3);
    const [xValue, setXValue] = useState(0);
    const [points, setPoints] = useState(Array(3).fill().map(() => ({ x: '', y: '' })));
    const [result, setResult] = useState(null);
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

    const memo = {};
    const calculateMemo = (points, x1, x2) => {
        let key = `${x1}:${x2}`;
        if (memo[key] !== undefined) {
            return memo[key];
        }
        if (Math.abs(x1 - x2) <= 1) {
            memo[key] = (points[x1].y - points[x2].y) / (points[x1].x - points[x2].x);
            return memo[key];
        }
        const fx = (calculateMemo(points, x1, x2 + 1) - calculateMemo(points, x1 - 1, x2)) / 
                  (points[x1].x - points[x2].x);
        memo[key] = fx;
        return fx;
    };

    const calculateFX = (xTarget, validPoints) => {
        const tempC = Array.from(
            { length: validPoints.length }, 
            (_, i) => i === 0 ? validPoints[0].y : calculateMemo(validPoints, i, 0)
        );
        let result = 0;
        for (let i = 0; i < tempC.length; i++) { 
            let term = tempC[i];  
            for (let j = 0; j < i; j++) {
                term *= (xTarget - validPoints[j].x);
            }
            result += term;
        }
        console.log(tempC);
        return {result, tempC}; 
    };
    const formatNumber = (num) => {
        const absNum = Math.abs(num);
        if (absNum < 0.0001 || absNum >= 10000) {
            return num.toExponential(6);
        }
        return num.toFixed(4);
    };
    
    const generateSteps = (xTarget, points, coefficients, resultValue) => { 
        const steps = [];
        const n = points.length;
        const formattedPoints = points
        .map((p, i) => `(${p.x}, ${p.y})`)
        .reduce((acc, point, i) => {
                if (i % 3 === 0) {
                    acc.push([point]);
                } else {
                    acc[acc.length - 1].push(point);
                }
                return acc;
            }, [])
            .map(line => line.join(", "))
            .join(" \\\\ \\quad ");

        steps.push({
            latex: "\\text{Given points: } \\\\ \\quad " + formattedPoints
        });
        steps.push({
            latex: "\\text{Divided differences: }"
                + coefficients.map((coeff, i) => `C_{${i}} = ${formatNumber(coeff)}`).join(", ") 
        });
        let polynomial = `f_{${n-1}}(x) = ${formatNumber(coefficients[0])}`; 
        let term = "";
        
        for (let i = 1; i < n; i++) {
            term += `(${xTarget} - ${points[i-1].x})`;
            polynomial += coefficients[i] >= 0 ? " + " : " "; 
            polynomial += `${formatNumber(coefficients[i])}${term}`;
        }
        steps.push({
            latex: "\\text{Newton polynomial: }"
        });
        steps.push({
            latex: polynomial
        });
        steps.push({
            latex: `\\text{Evaluating at } x = ${xTarget}`
        });
        steps.push({
            latex: `f_{${n-1}}(${xTarget}) = ${resultValue.toFixed(4)}`
        });
        return steps;
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
    
        if (validPoints.length >= 2) {
            const {result, tempC} = calculateFX(parseFloat(xValue), validPoints);  
            const calculationSteps = generateSteps(parseFloat(xValue), validPoints, tempC, result);
            setResult(result);
            setSteps(calculationSteps);
        } else {
            alert("Please select at least 2 valid points");
        }
    };

    const toggleAll = () => {
        const allSelected = selectedPoints.every(Boolean);
        setSelectedPoints(Array(numberOfPoints).fill(!allSelected));
    };

    return (
        <div className="flex flex-col items-center mt-8 max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Newton's Divided Difference</h2>
            
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
                {result !== null && (
                    <>
                        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-wrap">
                            <h3 className="text-lg font-bold mb-4">Solution</h3>
                            <div className="space-y-4">
                                {steps.map((step, index) => (
                                    <div key={index} className="ml-4">
                                        <InlineMath>{step.latex}</InlineMath>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewtonDivided;