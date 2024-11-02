import React, { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import MathEquation from "./Component/Elements/MathEquation";

const SimpsonCalculator = () => {
    const [equation, setEquation] = useState("x^7+2x^3-1");
    const [isValidEquation, setIsValidEquation] = useState(true);
    const [a, setA] = useState(-1);
    const [b, setB] = useState(2);
    const [n, setN] = useState(4);
    const [result, setResult] = useState(null);
    const [calculationSteps, setCalculationSteps] = useState([]);
    const [error, setError] = useState(null);
    const [isSingleRule, setIsSingleRule] = useState(false);

    const validateEquation = () => {
        try {
            evaluate(equation, { x: 1 });
            setIsValidEquation(true);
            setError(null);
        } catch (error) {
            console.log("Invalid equation:", error.message);
            setIsValidEquation(false);
            setCalculationSteps([]);
            setResult(null);
        }
    };

    useEffect(() => {
        validateEquation();
        validateInputs();
    }, [equation, a, b, n]);

    const validateInputs = () => {
        setError(null);
        
        if (a === "" || b === "" || n === "") {
            setError("Please fill in all fields");
            return false;
        }

        if (isNaN(a) || isNaN(b) || isNaN(n)) {
            setError("Please enter valid numbers");
            return false;
        }

        if (n <= 0 || !Number.isInteger(Number(n))) {
            setError("Number of segments must be a positive integer");
            return false;
        }

        if (parseFloat(a) >= parseFloat(b)) {
            setError("Lower bound must be less than upper bound");
            return false;
        }

        return true;
    };

    const getIntegralEquation = () => {
        return `\\int_{${a}}^{${b}} (${equation}) dx`;
    };

    const handleSingleRuleToggle = () => {
        setIsSingleRule(!isSingleRule);
        if (!isSingleRule) {
            setN(1);
        }
    };

    const calculateSimpson = () => {
        if (!validateInputs()) {
            return;
        }

        try {
            const steps = [];
            const numA = parseFloat(a);
            const numB = parseFloat(b);
            const numN = parseInt(n);
            
            const h = (numB - numA) / (2 * numN);
            steps.push({
                explanation: "Calculate h (width of each segment)",
                latex: `h = \\frac{${b} - ${a}}{2(${n})} = ${h.toFixed(4)}`
            });

            const start = evaluate(equation, { x: numA });
            steps.push({
                explanation: "Calculate f(a) - first value",
                latex: `f(${a}) = ${start.toFixed(4)}`
            });

            let odd = 0;
            let even = 0;

            if (numN > 1) {
                steps.push({
                    explanation: "Calculate middle points",
                    latex: "\\text{Middle points calculation:}"
                });

                for (let i = 1; i < 2 * numN; i++) {
                    const x = numA + i * h;
                    const fx = evaluate(equation, { x: x });
                    
                    if (i % 2 !== 0) {
                        odd += (4 * fx);
                        steps.push({
                            explanation: `Odd point ${i}`,
                            latex: `4f(${x.toFixed(4)}) = 4(${fx.toFixed(4)}) = ${(4 * fx).toFixed(4)}`
                        });
                    } else {
                        even += (2 * fx);
                        steps.push({
                            explanation: `Even point ${i}`,
                            latex: `2f(${x.toFixed(4)}) = 2(${fx.toFixed(4)}) = ${(2 * fx).toFixed(4)}`
                        });
                    }
                }
            }

            const end = evaluate(equation, { x: numB });
            steps.push({
                explanation: "Calculate f(b) - last value",
                latex: `f(${b}) = ${end.toFixed(4)}`
            });

            steps.push({
                explanation: "Sum of odd terms",
                latex: `\\sum \\text{odd terms} = ${odd.toFixed(4)}`
            });

            steps.push({
                explanation: "Sum of even terms",
                latex: `\\sum \\text{even terms} = ${even.toFixed(4)}`
            });

            const finalResult = (h / 3) * (start + end + odd + even);
            
            steps.push({
                explanation: "Final calculation",
                latex: `\\text{Result} = \\frac{${h}}{3}[${start.toFixed(4)} + ${end.toFixed(4)} + ${odd.toFixed(4)} + ${even.toFixed(4)}] = ${finalResult.toFixed(4)}`
            });

            setCalculationSteps(steps);
            setResult(finalResult);
            setError(null);

        } catch (error) {
            setError("Error in calculation. Please check your inputs.");
            setResult(null);
            setCalculationSteps([]);
        }
    };

    const handleInputChange = (setValue) => (e) => {
        setValue(e.target.value);
        setError(null);
        setResult(null);
        setCalculationSteps([]);
    };

    return (
        <div className="flex flex-col items-center mt-20">
            <h2 className="text-center text-5xl mb-10">Simpson Rule</h2>
            <div className="relative flex flex-col items-center mb-4 rounded-lg border-black border-2 p-10 mt-auto justify-center">
                <button
                    onClick={handleSingleRuleToggle}
                    className={`absolute top-4 right-4 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 
                        ${isSingleRule 
                            ? 'bg-orange-500 text-white hover:bg-orange-600' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    Single
                </button>

                <div className="flex flex-col mb-2">
                    <label className="mb-1">Lower Bound (a):</label>
                    <input
                        type="number"
                        value={a}
                        onChange={handleInputChange(setA)}
                        className={`rounded px-3 py-2 placeholder-gray-500 border ${error && (a === "" || isNaN(a)) ? 'border-red-500' : ''}`}
                        placeholder="Enter lower bound..."
                        required
                    />
                </div>
                <div className="flex flex-col mb-2">
                    <label className="mb-1">Upper Bound (b):</label>
                    <input
                        type="number"
                        value={b}
                        onChange={handleInputChange(setB)}
                        className={`rounded px-3 py-2 placeholder-gray-500 border ${error && (b === "" || isNaN(b)) ? 'border-red-500' : ''}`}
                        placeholder="Enter upper bound..."
                        required
                    />
                </div>
                <div className="flex flex-col mb-2">
                    <label className="mb-1">Number of Segments (n):</label>
                    <input
                        type="number"
                        value={n}
                        onChange={handleInputChange(setN)}
                        className={`rounded px-3 py-2 placeholder-gray-500 border 
                            ${error && (n <= 0 || !Number.isInteger(Number(n))) ? 'border-red-500' : ''}
                            ${isSingleRule ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        placeholder="Enter number of segments..."
                        required
                        disabled={isSingleRule}
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-1">Enter Equation (in x):</label>
                    <input
                        type="text"
                        value={equation}
                        onChange={(e) => setEquation(e.target.value)}
                        className={`border rounded px-3 py-2 ${!isValidEquation ? 'border-red-500' : ''}`}
                        required
                    />
                </div>
                <div>
                    {isValidEquation && equation !== "" ? (
                        <div className="mb-2 flex items-center">
                            Equation: <MathEquation equation={getIntegralEquation()} />
                        </div>
                    ) : (
                        <p className="text-red-500 mt-1">Please enter a valid equation.</p>
                    )}
                </div>
                {error && (
                    <div className="text-red-500 text-sm mb-2">{error}</div>
                )}
                <button
                    onClick={calculateSimpson}
                    className={`bg-black px-6 py-2 rounded-md text-white mb-5 mt-5 ${(!isValidEquation || error) ? 'opacity-50 cursor-not-allowed' : ''} hover:scale-105 transition ease-out duration-200 hover:bg-orange-500 hover:text-black`}
                    disabled={!isValidEquation || error}
                >
                    Calculate
                </button>
                {result !== null && (
                    <div className="text-center text-xl mt-10 mb-5">
                        Answer: {result.toFixed(4)}
                    </div>
                )}
            </div>
            {calculationSteps.length > 0 && <div className='bg-white rounded-lg border-black border-2 p-10 shadow-md'>
                {calculationSteps.length > 0 && (
                    <div className="text-left mt-10 mb-5">
                        <h3 className="text-xl mb-4">Solution Steps:</h3>
                        <div className="space-y-4">
                            {calculationSteps.map((step, index) => (
                                <div key={index} className="mb-4">
                                    <div className="font-medium mb-1">{step.explanation}</div>
                                    <MathEquation equation={step.latex} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            }
        </div>
    );
};

export default SimpsonCalculator;