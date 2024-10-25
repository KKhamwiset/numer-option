import { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import TableCell from './Component/Elements/TableCell';
import MathEquation from './Component/Elements/MathEquation';
import Graph from './Component/Elements/Graph';

const Secant = () => {
    const [tolerance, setTolerance] = useState(1e-6);
    const [x0, setX0] = useState(0);
    const [x1, setX1] = useState(1);
    const [Equation, setEquation] = useState("(x^2)-7");
    const [data, setData] = useState([]);
    const [isValidEquation, setIsValidEquation] = useState(true);
    const [answer, setAnswer] = useState(null);

    useEffect(() => {
        validateEquation();
    }, [Equation]);

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

    const calculateSecant = () => {
        let iterations = [];
        let iteration = 0;
        let x_prev = x0;
        let x_curr = x1;
        let fx_prev = evaluate(Equation, { x: x_prev });
        let fx_curr = evaluate(Equation, { x: x_curr });
        let currentError = Math.abs(x_curr - x_prev);
        iterations.push({
            iteration: iteration + 1,
            X: x_prev,
            fx: fx_prev,
            error: currentError
        });
        
        iterations.push({
            iteration: iteration + 2,
            X: x_curr,
            fx: fx_curr,
            error: currentError
        });

        while (currentError > tolerance && iteration < 100) {
            const slope = (fx_curr - fx_prev) / (x_curr - x_prev);
            if (slope === 0) {
                setAnswer("Slope is zero. No solution found.");
                return;
            }
            
            const x_next = x_curr - (fx_curr / slope);
            const fx_next = evaluate(Equation, { x: x_next });
            
            currentError = Math.abs(x_next - x_curr);
            
            iterations.push({
                iteration: iteration + 3,
                X: x_next,
                fx: fx_next,
                error: currentError
            });
            
            x_prev = x_curr;
            x_curr = x_next;
            fx_prev = fx_curr;
            fx_curr = fx_next;
            iteration++;
        }
        
        setData(iterations);
        setAnswer(`Answer: ${x_curr.toFixed(6)}`);
    };

    const Table = () => {
        return (
            <div className="overflow-x-auto mb-20">
                <h3 className="text-center text-xl mt-10 mb-5">Secant Method Table</h3>
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
                                <TableCell additionalClasses="text-center">{element.iteration}</TableCell>
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

    return (
        <div className="flex flex-col items-center mt-20">
            <h2 className="text-center text-5xl mb-10">Secant Method</h2>
            <div className="flex flex-col items-center mb-4 rounded-lg border-black border-2 p-10 mt-auto justify-center">
                <div className='flex flex-col mb-2'>
                    <label className='mb-1'>Enter X0: </label>
                    <input
                        type='number'
                        value={x0}
                        onChange={(e) => setX0(Number(e.target.value))}
                        className='rounded px-3 py-2 placeholder-gray-500 border'
                    />
                </div>
                <div className='flex flex-col mb-2'>
                    <label className='mb-1'>Enter X1: </label>
                    <input
                        type='number'
                        value={x1}
                        onChange={(e) => setX1(Number(e.target.value))}
                        className='rounded px-3 py-2 placeholder-gray-500 border'
                    />
                </div>
                <div className='flex flex-col mb-2'>
                    <label className='mb-1'>Enter Equation (in x): </label>
                    <input
                        type='text'
                        value={Equation}
                        onChange={(e) => setEquation(e.target.value)}
                        className={`rounded px-3 py-2 placeholder-gray-500 border ${isValidEquation ? "" : "border-red-500"}`}
                    />
                </div>
                <div className='flex justify-center'>
                    {isValidEquation && Equation !== '' ? 
                        <div className="mb-2 flex"> 
                            Equation: <MathEquation equation={`f(x) = ${Equation}`} />
                        </div> 
                    : <p className='text-red-500'>Please enter a valid equation.</p>}
                </div>
                <button onClick={calculateSecant} className={`btn-primary text-white mb-5 mt-5 ${!isValidEquation ? 'opacity-50 cursor-not-allowed' : ''} 
                transition ease-out duration-200 hover:scale-105 hover:bg-orange-500 hover:text-black`} 
                disabled={!isValidEquation}>
                    Calculate
                </button>
                {answer}
            </div>
            <div className="div">
                {data.length > 0 && isValidEquation && Equation !== '' ? <Table /> : null}
            </div>
            <div className="div">
                {data.length > 0 && isValidEquation && Equation !== '' ? <Graph method= {"secant"} data={data} equation={Equation} /> : null}
            </div>
        </div>
    );
}

export default Secant;