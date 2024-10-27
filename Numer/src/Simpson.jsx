import { useState } from "react";
import { evaluate } from 'mathjs';

const Simpson = () => {
    const SimpsonCalculation = (a,b,equation,n) => {
        const h = (b - a) / (2 * n);
        let odd = 0;
        let even = 0;
        for (let i = 1; i < 2 * n; i++) {
            if (i % 2 !== 0) {
                odd += (4 * evaluate(equation, { x: a + i * h }));
            } else {
                even += (2 * evaluate(equation, { x: a + i * h }));
            }
        }
        const start = evaluate(equation, { x: a })
        const end = + evaluate(equation, { x: b })
        console.log(start,end,odd,even);
        return (h / 3) * (start + end + odd + even);
    }
    console.log(SimpsonCalculation(-1, 2, 'x^7+2x^3-1', 1))
    console.log(SimpsonCalculation(-1, 2, 'x^7+2x^3-1', 2))
    console.log(SimpsonCalculation(-1, 2, 'x^7+2x^3-1', 4))
    console.log(SimpsonCalculation(-1, 2, 'x^7+2x^3-1', 6))
}

export default Simpson;