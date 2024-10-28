import { useState, useEffect } from "react";
import { evaluate } from 'mathjs';
import MathEquation from "./Component/Elements/MathEquation";
import TableCell from "./Component/Elements/TableCell";
import Graph from "./Component/Elements/Graph";

const OnePoint = () => {
    const [Equation, setEquation] = useState("(1 / 2) * (x + 7 / x)");
    const [data, setData] = useState([]);
    const [isValidEquation, setIsValidEquation] = useState(true);
    const [answer, setAnswer] = useState(null);
    const [xStart, setXStart] = useState(1);
    const [tolerance, setTolerance] = useState(1e-6); 
    
    const validateEquation = () => {
        try {
            evaluate(Equation, { x: 1 });
            setIsValidEquation(true);
        } catch (error) {
            console.log("Invalid equation:", error.message);
            setIsValidEquation(false);
            setData([]);
            setAnswer(null);
        }
    };

    useEffect(() => {
        validateEquation();
    }, [Equation]);

    const showAnswer = (value) => {
        return (
            <div className="text-center text-xl mt-10 mb-5"> Answer : {value.toPrecision(7)} </div>
        );
    }

    const CalculateOnePointIteration = (xInit) => {
        let iterationData = [];
        let x = parseFloat(xInit);
        let iter = 0;
        let xNew = evaluate(Equation, { x: x });
        let error = Math.abs(((xNew - x) / xNew) * 100);
        iterationData.push({ iteration: iter, X: x, fx: xNew, error: error });
        while (Math.abs(xNew - x) > tolerance && iter < 100) {
            iter++;
            x = xNew;
            xNew = evaluate(Equation, { x: x });
            error = Math.abs(((xNew - x) / xNew) * 100);
            iterationData.push({ iteration: iter, X: x, fx: xNew ,error: error });
        }

        setData(iterationData);
        setAnswer(showAnswer(xNew));
    };

    const Table = () => {
        return (
            <div className="overflow-x-auto mb-20">
                <h3 className="text-center text-xl mt-10 mb-5">One-Point Iteration Method Table</h3>
                <table className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
                    <thead className="bg-slate-500">
                        <tr>
                            <TableCell additionalClasses="text-center text-white">Iteration</TableCell>
                            <TableCell additionalClasses="text-center text-white">X</TableCell>
                            <TableCell additionalClasses="text-center text-white">
                                <MathEquation equation={`f(x)= ${Equation}`} />
                            </TableCell>
                            <TableCell additionalClasses="text-center text-white">Error</TableCell>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((element, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-slate-300" : "bg-white"}>
                                <TableCell additionalClasses="text-center">{element.iteration + 1}</TableCell>
                                <TableCell>{element.X.toFixed(6)}</TableCell>
                                <TableCell additionalClasses="text-center">{element.fx.toPrecision(6)}</TableCell>
                                <TableCell additionalClasses="text-center">{element.error.toFixed(6)}</TableCell>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    const calOnePoint = () => {
        CalculateOnePointIteration(xStart);
    };

    return (
        <div className="flex flex-col items-center mt-20">
            <h2 className="text-center text-5xl mb-10">One-Point Iteration Method</h2>
            <div className="flex flex-col items-center mb-4 rounded-lg border-black border-2 p-10 mt-auto justify-center">
                <div className="flex flex-col mb-2">
                    <label className="mb-1">Enter X-Start:</label>
                    <input
                        type="number"
                        value={xStart}
                        onChange={(e) => setXStart(e.target.value)}
                        className="rounded px-3 py-2 placeholder-gray-500 border"
                        placeholder="Enter X-Start value ..."
                        required
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-1">Enter Equation (in x):</label>
                    <input
                        type="text"
                        value={Equation}
                        onChange={(e) => setEquation(e.target.value)}
                        className={`border rounded px-3 py-2 ${!isValidEquation ? 'border-red-500' : ''}`}
                        required
                    />
                </div>
                <div>
                {isValidEquation && Equation !== "" ? ( <div className="mb-2 flex"> 
                    Equation: <MathEquation equation={`f(x) = ${Equation}`} />
                    </div>
                    ) : (
                    <p className="text-red-500 mt-1">Please enter a valid equation.</p>
                    )}
                </div>
                    <button 
                    onClick={calOnePoint} 
                    className={`btn-primary text-white mb-5 mt-5 ${!isValidEquation ? 'opacity-50 cursor-not-allowed' : ''} hover:scale-105 
                    transition ease-out duration-200 hover:bg-orange-500 hover:text-black`} 
                    disabled={!isValidEquation}
                    >
                    Calculate
                    </button>
                {answer}
            </div>
            <div className='container flex flex-row justify-center overflow-x-auto'>
                {data.length > 0  && isValidEquation &&<Graph method ={"onepoint"} data={data} equation={Equation}/>}
            </div>
            <div className="container flex flex-column justify-center m-auto">
                {data.length > 0  && isValidEquation &&<Table />}
            </div>
        </div>
    );
};

export default OnePoint;
