import React, { useState } from "react";
import './index.css'
import { evaluate } from 'mathjs';
import TableCell from "./Component/TableCell";
import BisectionGraph from "./Component/BisectionGraph";
import MathEquation from "./Component/MathEquation";
function Bisection() {  
    const CalculateBisection = (xl, xr) => {
      let fxrnum = evaluate(Equation, { x: xr });
      let currentError;
      let newData = [];
      let iter = 0;
      let xm,fxm;
      do {
        xm = (xl + xr) / 2; 
        fxm = evaluate(Equation, { x: xm });
        currentError = Math.abs(fxm); 
        newData.push({
          iteration: iter,
          Xl: xl,
          Xm: xm,
          Xr: xr,
          error: currentError,
          fxm: fxm
        });
        if (fxm == 0.0){
          break;
        }
        else if (fxm * fxrnum > 0) {
          xr = xm;
        } else {
          xl = xm;
        }
        iter++; 
      } while (Math.abs(fxm) >= tolerance); 
      setAnswer(showAnswer(xm));
      setData(newData); 
    }
  const [xl, setXl] = useState(0);
  const [xr, setXr] = useState(0);
  const [data, setData] = useState([]);
  const [Equation, setEquation] = useState("(x^4) - 13");
  const tolerance = 1e-6;
  const [answer,setAnswer] = useState(null);

  const calculateRoot = () => {
    if (evaluate(Equation, { x: xl }) > 0) {
      alert("No possible answer in given range.");
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
        <h3 className="text-center text-xl mt-10 mb-5">Bisection Method Table</h3>
        
        <table className="relative overflow-x-auto shadow-md sm:rounded-lg" style={{borderWidth: 0}}>
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
                <TableCell additionalClasses="text-center">{element.iteration + 1}</TableCell>
                <TableCell >{element.Xl.toFixed(6)}</TableCell>
                <TableCell >{element.Xm.toFixed(6)}</TableCell>
                <TableCell >{element.Xr.toFixed(6)}</TableCell>
                <TableCell >{element.error.toFixed(6)}</TableCell>
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
            className="rounded px-3 py-2 placeholder-gray-500 border"
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
      <div className='container flex flex-column justify-center m-auto'>
        {data.length > 0 && <BisectionGraph data={data} equation={Equation} />}
      </div>
      <div className="container flex flex-column justify-center m-auto">
        {data.length > 0 && output()}
      </div>
    </div> 
  );
}
export default Bisection;
