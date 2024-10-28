import { useState } from "react";
import { evaluate } from 'mathjs';
const trapezoidal = () => {
    const [result, setResult] = useState(0);
    const [a, setA] = useState(0);
    const [b, setB] = useState(0);
    const [n, setN] = useState(0);
    const [equation, setEquation] = useState("")
    const trapezoidal = (a,b,equation,n) => {
        let h = (b-a)/ n;
        let sum = 0;
        for(let i= 1 ;i < n ; i++){
            sum += evaluate(equation,{x:a+i*h});
        }
        sum = (h/2)*(evaluate(equation,{x:a}) + evaluate(equation,{x:b}) + (2*sum));
        return sum;
    }
    console.log(trapezoidal(2,8,'4x^5-3x^4+x^3-6x+2',1))
    console.log(trapezoidal(2,8,'4x^5-3x^4+x^3-6x+2',2))
    console.log(trapezoidal(2,8,'4x^5-3x^4+x^3-6x+2',4))
    console.log(trapezoidal(-2,4,'2x^5-4x^3-x+1',6))
};

export default trapezoidal;