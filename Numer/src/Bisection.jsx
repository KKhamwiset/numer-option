import { useState, useEffect } from "react";
import { evaluate } from 'mathjs';
import TableCell from "./Component/Elements/TableCell";
import Graph from "./Component/Elements/Graph";
import MathEquation from "./Component/Elements/MathEquation";
import axios from "axios";

function Bisection() {  
  const [xl, setXl] = useState(1);
  const [xr, setXr] = useState(2);
  const [data, setData] = useState([]);
  const [Equation, setEquation] = useState("(x^4) - 13");
  const tolerance = 1e-6;
  const [answer, setAnswer] = useState(null);
  const [isValidEquation, setIsValidEquation] = useState(true);

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

  const CalculateBisection = (xl, xr) => {
    xl = parseFloat(xl);
    xr = parseFloat(xr);
    let tXl = xl;
    let tXr = xr;
    let fxrnum = evaluate(Equation, { x: xr });
    let currentError;
    let newData = [];
    let iter = 0;
    let xm, fxm;
    do {
      xm = (xl + xr) / 2; 
      fxm = evaluate(Equation, { x: xm });
      currentError = Math.abs(xr - xl); 
      newData.push({
        iteration: iter,
        Xl: xl,
        Xm: xm,
        Xr: xr,
        error: currentError,
        fxm: fxm
      });
      if (fxm === 0.0) {
        break;
      } else if (fxm * fxrnum > 0) {
        xr = xm;
      } else {
        xl = xm;
      }
      iter++; 
    } while (currentError >= tolerance);
    const apiUrl = import.meta.env.API_URL;
    axios.post(`${apiUrl}/Root_of_Equation/api/calculate`, {
      subtype: 'bisection',
      x_start: tXl,
      x_end: tXr,
      equation: Equation,
      answer: xm
      })
      .then((response) => {
          console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
          console.log(error);
      });
        setAnswer(showAnswer(xm));
        setData(newData); 
    };

  const calculateRoot = () => {
 
    if (parseFloat(xl) >= (xr)) {
      alert("XL must be less than XR.");
      return;
    }
  
    const fxl = evaluate(Equation, { x: xl });
    const fxr = evaluate(Equation, { x: xr });
  
    if (fxl * fxr >= 0 && xl >= 0 && xr >= 0) {
      alert("Can't find root. Please adjust XL and XR.");
      return;
    }
  
    try {
      CalculateBisection(xl, xr);
    } catch (error) {
      alert("Error evaluating the equation: " + error.message);
    }
  };
  

  const Table = () => {
    return (
      <div className="overflow-x-auto mb-20">
        <h3 className="text-center text-xl mt-10 mb-5">Bisection Method Table</h3>
        <table className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
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
                <TableCell>{element.Xl.toFixed(6)}</TableCell>
                <TableCell>{element.Xm.toFixed(6)}</TableCell>
                <TableCell>{element.Xr.toFixed(6)}</TableCell>
                <TableCell>{element.error.toFixed(6)}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const showAnswer = (xm) => {
    return (
      <div>
        <div className="text-center text-xl mt-10 mb-5"> Answer : {xm.toFixed(6)} </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-center text-5xl mb-10">Bisection Method</h2>
      <div className="flex flex-col items-center mb-4 rounded-lg border-black border-2 p-10 mt-auto justify-center">
        <div className="flex flex-col mb-2">
          <label htmlFor="xl" className="mb-1">Enter XL:</label>
          <input 
            id="xl" 
            type="number"
            value={xl===0 ? "" : xl} 
            onChange={(e) => setXl(e.target.value)} 
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
            value={xr===0 ? "" : xr}
            onChange={(e) => setXr(e.target.value)} 
            className="border rounded px-3 py-2 placeholder-gray-500"
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
          onClick={calculateRoot} 
          className={`btn-primary text-white mb-5 mt-5 ${!isValidEquation ? 'opacity-50 cursor-not-allowed' : ''} hover:scale-105 
          transition ease-out duration-200 hover:bg-orange-500 hover:text-black`} 
          disabled={!isValidEquation}
        >
          Calculate
        </button>
        {answer}
      </div>
      <div className='container flex flex-row justify-center overflow-x-auto'>
        {data.length > 0 && <Graph method = "bisection" data={data} equation={Equation} />}
      </div>
      <div className="container flex flex-column justify-center m-auto">
        {data.length > 0 && <Table/>}
      </div>
    </div> 
  );
}

export default Bisection;
