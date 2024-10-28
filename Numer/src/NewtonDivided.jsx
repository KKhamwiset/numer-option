import { useState } from "react";

const NewtonDivided = () => {
    const [numberOfPoints, setNumberOfPoints] = useState(3);
    const [xValue, setXValue] = useState(0);
    const [points, setPoints] = useState(Array(3).fill().map(() => ({ x: '', y: '' })));
    const [result, setResult] = useState(null);
    const [selectedPoints, setSelectedPoints] = useState(Array(3).fill(false));

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
        const C = Array.from(
            { length: validPoints.length }, 
            (_, i) => i === 0 ? validPoints[0].y : calculateMemo(validPoints, i, 0)
        );
        
        let result = 0;
        for (let i = 0; i < C.length; i++) {
            let term = C[i];
            for (let j = 0; j < i; j++) {
                term *= (xTarget - validPoints[j].x);
            }
            result += term;
        }
        return result;
    };

    const handleCalculate = () => {
        const validPoints = points.filter((point, index) => 
            selectedPoints[index] && 
            point.x !== '' && 
            point.y !== '' &&
            !isNaN(point.x) && 
            !isNaN(point.y)
        );
        if (validPoints.length >= 2) {
            const result = calculateFX(parseFloat(xValue), validPoints);
            setResult(result);
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
                        Calculate!
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
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                        <p className="font-medium">Result: {result}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewtonDivided;