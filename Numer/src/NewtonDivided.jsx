import { useState,useEffect } from "react";
import { evaluate,derivative } from 'mathjs';

const NewtonDivided = () => {
    const [data, setData] = useState([]);
    const [point,setPoint] = useState(0);
    const [xValue,setXValue] = useState(0);
    const C = [];
    const CalculateC = () => {
        const n = x.length;
        for (let i = 0; i < n; i++) {
            C[i] = y[i];
            for (let j = 0; j < n - i - 1; j++) {
                C[j] = (C[j + 1] - C[j]) / (x[j + i + 1] - x[j]);
            }
        }
    }
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