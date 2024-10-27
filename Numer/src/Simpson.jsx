import { useState } from "react";
import { evaluate } from 'mathjs';

const Simpson = () => {
    const SimpsonCalculation = (a,b,equation,n) => {
        const h = (b - a) / (2 * n);
        let odd = 0;
        let even = 0;
        for (let i = 1; i < n; i++) {
            if (i % 2 !== 0) {
                odd += (4 * evaluate(equation, { x: a + i * h }));
            } else {
                even += (2 * evaluate(equation, { x: a + i * h }));
            }
        }
        return (h / 3) * (evaluate(equation, { x: a }) + evaluate(equation, { x: b }) + odd + even);
    }
    SimpsonCalculation(2, 8, '4x^5-3x^4+x^3-6x+2', 1)
    SimpsonCalculation(2, 8, '4x^5-3x^4+x^3-6x+2', 2)
    SimpsonCalculation(2, 8, '4x^5-3x^4+x^3-6x+2', 4)
    SimpsonCalculation(2, 8, '4x^5-3x^4+x^3-6x+2', 6)
}

export default Simpson;