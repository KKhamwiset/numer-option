import { useState,useEffect } from "react";
import { evaluate,derivative } from 'mathjs';

const NewtonDivided = () => {
    const [data, setData] = useState([]);
    const [point,setPoint] = useState(0);
    const [xValue,setXValue] = useState(0);
    const points = [
	    { x: 0, y: 9.81 },
	    { x: 20000, y: 9.7487 },
	    { x: 40000, y: 9.6879 },
	    { x: 60000, y: 9.6879 },
	    { x: 80000, y: 9.5682 }
    ];
    const [memo,setMemo] = useState({});
    const CalculateMemo = (x1,x2) => {
        let key = `${x1},${x2}`;
        if(memo[key] !== undefined) {
            return memo[key];
        }
        if (Math.abs(x1 - x2) <= 1) // Check if the difference is less than 1 means calculation smallest term
        // ex. f[x1,x0]
        {
            memo[key] = points[x1].y - points[x2].y / points[x1].x - points[x2].x;
            return memo[key];
        }
        //recusive call
        let fx = (CalculateMemo(x1 + 1, x2) - CalculateMemo(x1, x2 - 1)) / (points[x1].x - points[x2].x);
        memp[key] = fx;
        return fx;
    }
    const C = Array.from({ length: points.length - 1 }, (_, i) => i > 0 ? CalculateMemo(i, i + 1) : 0);
    console.log(C)
    const CalculateFX = (xTarget) => {
        const n = C.length;
        let result = 0;
        for (let i = 0; i < n; i++) {
            let term = C[i];
            for (let j = 0; j < i; j++) {
                term *= (xTarget - x[j]);
            }
            result += term;
        }
        return result;
    }
    return (
    <>
        <div className="flex flex-col items-center mt-20">
            <h2 className="text-center text-5xl mb-10">Newton Divided Difference</h2>
            <div className="flex flex-col items-center mb-4 rounded-lg border-black border-2 p-10 mt-auto justify-center">

            </div>
        </div>
    </>
    )
}
export default NewtonDivided;