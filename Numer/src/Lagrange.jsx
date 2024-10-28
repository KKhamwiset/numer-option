import { useState } from "react";
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const Lagrange = () => {
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

    const formatNumber = (num) => {
        const absNum = Math.abs(num);
        if (absNum < 0.0001 || absNum >= 10000) {
            return num.toExponential(6);
        }
        return num.toFixed(4);
    };

    const LagrangeCalculation = (x, validPoints) => {
        const n = validPoints.length;
        let result = 0;
        const terms = [];
        for (let i = 0; i < n; i++) {
            let term = 1;
            let termSteps = `L_{${i}}(x) = `;
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    term *= (x - validPoints[j].x) / (validPoints[i].x - validPoints[j].x);
                    termSteps += `\\frac{(x - ${validPoints[j].x})}{(${validPoints[i].x} - ${validPoints[j].x})}`;
                    if (j < n - 1) termSteps += " \\cdot ";
                }
            }
            result += term * validPoints[i].y;
            terms.push({
                basis: termSteps,
                coefficient: term,
                value: term * validPoints[i].y
            });
        }

        return { result, terms };
    };

    const generateSteps = (xTarget, points, calculation) => {
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
            latex: "\\text{Lagrange basis polynomials:}"
        });

        calculation.terms.forEach((term, i) => {
            steps.push({
                latex: term.basis + " = " + formatNumber(term.coefficient)
            });
        });

        let polynomial = `f_{${n-1}}(x) = `;
        calculation.terms.forEach((term, i) => {
            if (i > 0) polynomial += term.value >= 0 ? " + " : " ";
            if (i === 0) {
                polynomial += `${formatNumber(points[i].y)} \\cdot ${formatNumber(term.coefficient)}`;
            } else {
                polynomial += `${formatNumber(points[i].y)} \\cdot ${formatNumber(term.coefficient)}`;
            }
        });

        steps.push({
            latex: "\\text{Interpolation polynomial:}"
        });
        steps.push({
            latex: polynomial
        });

        steps.push({
            latex: `\\text{Evaluating at } x = ${xTarget}`
        });
        steps.push({
            latex: `f_{${n-1}}(${xTarget}) = ${formatNumber(calculation.result)}`
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
            const calculation = LagrangeCalculation(parseFloat(xValue), validPoints);
            const calculationSteps = generateSteps(parseFloat(xValue), validPoints, calculation);
            setResult(calculation.result);
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
            <h2 className="text-2xl font-bold mb-6">Lagrange Interpolation</h2>
            
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

export default Lagrange;