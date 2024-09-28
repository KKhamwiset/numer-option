import React, { useState } from "react";
import { evaluate } from 'mathjs';
import TableCell from "./Component/TableCell";
import BisectionGraph from "./Component/BisectionGraph";
import MathEquation from "./Component/MathEquation";

  function Bisection() {  
    const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;
    const CalculateBisection = (xl, xr) => {
      let fxlnum = evaluate(Equation, { x: xl });
      let currentError = Math.abs(xr - xl);
      let newData = [];
      let iter = 0;
      let xm;
      do {
        xm = (xl + xr) / 2; 
        const fxm = evaluate(Equation, { x: xm });

        if (fxm * fxlnum < 0) {
          xr = xm;
        } else {
          xl = xm;
        }
        currentError = Math.abs((xr - xl) / 2); 

        newData.push({
          iteration: iter,
          Xl: xl,
          Xm: xm,
          Xr: xr,
          error: currentError
        });
        iter++; 
      } while (currentError > tolerance); 
      setXm(xm);
      setAnswer(showAnswer(xm));
      setData(newData); 
    }

  const [xl, setXl] = useState(0);
  const [xr, setXr] = useState(0);
  const [xm, setXm] = useState(0);
  const [data, setData] = useState([]);
  const [Equation, setEquation] = useState("(x^4) - 13");
  const tolerance = 1e-6;
  const [answer,setAnswer] = useState(null);

  const calculateRoot = () => {
    if (xl == 0 ||  xr == 0) {
      alert("Please enter valid numbers.");
      return;
    }
    if (xl >= xr) {
      alert("XL must be less than XR.");
      return;
    }
    try {
      CalculateBisection(xl, xr);
    } catch (error) {
      alert("Error evaluating the equation: " + error.message);
    }
  }

  const output = () => {
    return (
      <div className="overflow-x-auto mb-20">
        <h3 className="text-center text-xl mt-10 mb-5"> Bisection Method Table </h3>
        <table className="min-w-50 m-auto rounded-lg shadow-md border-slate-300">
          <thead className="bg-slate-500">
            <tr>
              <TableCell additionalClasses="text-center text-white">Iteration</TableCell>
              <TableCell additionalClasses="text-center text-white">XL</TableCell>
              <TableCell additionalClasses="text-center text-white">XM</TableCell>
              <TableCell additionalClasses="text-center text-white">XR</TableCell>
              <TableCell additionalClasses="text-center text-white">Error</TableCell>
            </tr>
          </thead>
          <tbody>
            {data.map((element, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-slate-300" : "bg-white"}>
                <TableCell additionalClasses="text-center">{element.iteration}</TableCell>
                <TableCell>{element.Xl}</TableCell>
                <TableCell>{element.Xm}</TableCell>
                <TableCell>{element.Xr}</TableCell>
                <TableCell>{element.error}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  const showAnswer = (xm) => {
    return (
      <div>
        <div className="text-center text-xl mt-10 mb-5"> Answer : {xm.toFixed(6)} </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center mt-20 ">
      <h2 className="text-center text-5xl mb-10">Bisection Method</h2>
      <div className="flex flex-col items-center mb-4 rounded-lg border-black border-2 p-10 mt-auto justify-center">
        <div className="flex flex-col mb-2">
          <label htmlFor="xl" className="mb-1">Enter XL:</label>
          <input 
            id="xl" 
            type="number" 
            onChange={(e) => setXl(Number(e.target.value))} 
            className="border rounded px-3 py-2 placeholder-gray-500 border"
            placeholder= "Enter XL value ..." 
            required
          />
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="xr" className="mb-1">Enter XR:</label>
          <input 
            id="xr" 
            type="number" 
            onChange={(e) => setXr(Number(e.target.value))} 
            className="border rounded px-3 py-2 placeholder-gray-500 border"
            placeholder= "Enter XR value ..." 
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="equation" className="mb-1">Enter Equation (in x):</label>
          <input 
            id="equation" 
            type="text" 
            value={Equation} 
            onChange={(e) => setEquation(e.target.value)} 
            className="border rounded px-3 py-2" 
            required
          />
        </div>
        <div className="mb-2 flex">Equation : {<MathEquation equation={`$${"f(x)"}=$ $${Equation}$`} />}</div>
        <button onClick={calculateRoot} className="btn-primary text-white mb-5 mt-5">Calculate</button>
        {answer}
      </div>
      {data.length > 0 && <BisectionGraph data={data} />} 
      {data.length > 0 && output()}
    </div> 
  );
}

export default Bisection;
