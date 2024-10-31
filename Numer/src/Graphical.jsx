import { useState, useEffect } from "react";
import { evaluate } from 'mathjs';
import MathEquation from "./Component/Elements/MathEquation";
import TableCell from "./Component/Elements/TableCell";
import Graph from "./Component/Elements/Graph";
import axios from 'axios';

const Graphical = () => {
    const [Equation, setEquation] = useState("43x-180");
    const [data, setData] = useState([]);
    const [isValidEquation, setIsValidEquation] = useState(true);
    const [answer, setAnswer] = useState(null);
    const [xStart, setXStart] = useState(0);
    const [xEnd, setXEnd] = useState(10);
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

    const calculateGraphical = (xs, xe) => {
        let xStartNum = parseFloat(xs);
        let xEndNum = parseFloat(xe);
        let newData = [];
        let iter = 0;
        let fxnum = evaluate(Equation, { x: xStartNum });
        newData.push({ iteration: iter, X: xStartNum, fx: fxnum });
        let ztemp = xStartNum;
        let tolerance = [1, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12, 1e-13];
        let count = 0;
        while (count < tolerance.length && ztemp < xEndNum) {
            let temp = ztemp;
            ztemp += tolerance[count];
            fxnum = evaluate(Equation, { x: ztemp });
            if (fxnum > 0 && ztemp > 0) {
                ztemp = temp;
                count++;
                continue;
            }

            iter++;
            newData.push({ iteration: iter, X: ztemp, fx: fxnum });

            if (count >= tolerance.length) {
                break;
            }
        }
        const apiUrl = import.meta.env.VITE_API_URL; 
        axios.post(`${apiUrl}/api/calculate`, {
            subtype: 'graphical',
            x_start: xStartNum,
            x_end: xEndNum,
            equation: Equation,
            answer: ztemp})
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
        setData(newData);
        setAnswer(showAnswer(ztemp));
    };
    const Table = () => {
        return (
            <div className="overflow-x-auto mb-20">
                <h3 className="text-center text-xl mt-10 mb-5">Graphical Method Table</h3>
                <table className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
                    <thead className="bg-slate-500">
                        <tr>
                            <TableCell additionalClasses="text-center text-white">Iteration</TableCell>
                            <TableCell additionalClasses="text-center text-white">X</TableCell>
                            <TableCell additionalClasses="text-center text-white">
                                <MathEquation equation={`f(x) = ${Equation}`} />
                            </TableCell>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((element, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-slate-300" : "bg-white"}>
                                <TableCell additionalClasses="text-center">{element.iteration + 1}</TableCell>
                                <TableCell>{element.X.toFixed(6)}</TableCell>
                                <TableCell additionalClasses="text-center">{element.fx.toFixed(6)}</TableCell>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    const calculateEquation = () => {
        let fxStart = evaluate(Equation, { x: xStart });
        let fxEnd = evaluate(Equation, { x: xEnd });
        if (xStart >= xEnd) {
            alert("X-start must be less than X-end.");
            return;
        }
        if (fxStart * fxEnd > 0 && xStart >= 0 && xEnd >= 0) {
            alert("Can't find the answer.");
            return;
        }
        calculateGraphical(xStart, xEnd);
    };

    return (
        <div className="flex flex-col items-center mt-20">
            <h2 className="text-center text-5xl mb-10">Graphical Method</h2>
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
                <div className="flex flex-col mb-2">
                    <label className="mb-1">Enter X-End:</label>
                    <input
                        type="number"
                        value={xEnd}
                        onChange={(e) => setXEnd(e.target.value)}
                        className="rounded px-3 py-2 placeholder-gray-500 border"
                        placeholder="Enter X-End value ..."
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
                    {isValidEquation && Equation !== "" ? (
                        <div className="mb-2 flex">
                             Equation: <MathEquation equation={`f(x) = ${Equation}`} />
                        </div>
                    ) : (
                        <p className="text-red-500 mt-1">Please enter a valid equation.</p>
                    )}
                </div>
                <button
                    onClick={calculateEquation}
                    className={`btn-primary text-white mb-5 mt-5 ${!isValidEquation ? 'opacity-50 cursor-not-allowed' : ''} hover:scale-105 transition ease-out duration-200 hover:bg-orange-500 hover:text-black`}
                    disabled={!isValidEquation}>
                    Calculate
                </button>
                {answer}
            </div>
            <div className='container flex flex-row justify-center overflow-x-auto'>
                {data.length > 0 && <Graph method={"graphical"} data={data} equation={Equation} />}
            </div>
            <div className="container flex flex-column justify-center m-auto">
                {data.length > 0 && <Table />}
            </div>
        </div>
    );
};

export default Graphical;
