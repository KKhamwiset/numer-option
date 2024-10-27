import { useState,useEffect } from "react";

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
    const memo = {};
    const CalculateMemo = (x1,x2) => {
        let key = `${x1}:${x2}`;
        if(memo[key] !== undefined) {
            return memo[key];
        }
        if (Math.abs(x1 - x2) <= 1)
        {
            memo[key] = (points[x1].y - points[x2].y) / (points[x1].x - points[x2].x);
            return memo[key];
        }
        const fx = (CalculateMemo(x1 , x2 + 1) - CalculateMemo(x1 - 1, x2 )) / (points[x1].x - points[x2].x);
        memo[key] = fx;
        return fx;
    }
    console.log(memo);
    const C = Array.from({ length: points.length}, (_, i) => i == 0 ? points[0].y : CalculateMemo(i, 0));
    const CalculateFX = (xTarget) => {
        const n = C.length;
        let result = 0; 
        for (let i = 0; i < n; i++) {
            let term = C[i];
            for (let j = 0; j < i; j++) {
                term *= (xTarget - points[j].x);
            }
            result += term;
        }
        return result;
    }
    console.log(CalculateFX(42000));
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