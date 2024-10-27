import { useState } from "react";


const Lagrange = () => {

    const [point, setPoints] = useState([]);
    const [xValue, setXValue] = useState(0);
    const points = [
	    { x: 0, y: 9.81 },
	    { x: 20000, y: 9.7487 },
	    { x: 40000, y: 9.6879 },
	    { x: 60000, y: 9.6879 },
	    { x: 80000, y: 9.5682 }
    ];
    const LagrangeCalculation = (x) => {
        const n = points.length
        let result = 0
        for (let i = 0; i < n; i++) {
            let term = 1
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    term *= (x - points[j].x) / (points[i].x - points[j].x)
                }
            }
            result += term * points[i].y
        }
        return result
    }
    console.log(LagrangeCalculation(42000))
    return (
        <>
        </>
    )
}
export default Lagrange;