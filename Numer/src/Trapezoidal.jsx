import React, { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import MathEquation from "./Component/Elements/MathEquation";

const TrapezoidalCalculator = () => {
    const [equation, setEquation] = useState("4x^5-3x^4+x^3-6x+2");
    const [isValidEquation, setIsValidEquation] = useState(true);
    const [a, setA] = useState(2);
    const [b, setB] = useState(8);
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
    }, [equation, a, b , n]);

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

    const calculateTrapezoidal = () => {
        if (!validateInputs()) {
            return;
        }
        try {
            const numA = parseFloat(a);
            const numB = parseFloat(b);
            const numN = parseInt(n);
            const h = (b - a) / n;
            let sum = 0;

            for (let i = 1; i < numN; i++) {
                const x = numA + i * h;
                const fx = evaluate(equation, { x: x });
                sum += fx;
            }
            const finalResult = (h/2) * (evaluate(equation, { x: a }) + evaluate(equation, { x: b }) + (2 * sum));
            setResult(finalResult);
            setError(null);

        } catch (error) {
            setError("Error in calculation. Please check your inputs.");
            setResult(null);
        }
    };

    const handleInputChange = (setValue) => (e) => {
        setValue(e.target.value);
        setError(null);
        setResult(null);
    };

    return (
        <div className="flex flex-col items-center mt-20">
            <h2 className="text-center text-5xl mb-10">Trapezoidal Rule</h2>
            <div className="relative flex flex-col items-center mb-4 rounded-lg border-black border-2 p-10 mt-auto justify-center">
                <button
                    onClick={handleSingleRuleToggle}
                    className={`absolute top-4 right-4 rounded-md text-sm font-medium transition-all duration-200 
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
                    onClick={calculateTrapezoidal}
                    className={`btn-primary text-white mb-5 mt-5 ${(!isValidEquation || error) ? 'opacity-50 cursor-not-allowed' : ''} hover:scale-105 transition ease-out duration-200 hover:bg-orange-500 hover:text-black`}
                    disabled={!isValidEquation || error}
                >
                    Calculate
                </button>
                {result !== null && (
                    <div className="text-center text-xl mt-10 mb-5">
                        Answer : {result.toPrecision(7)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrapezoidalCalculator;