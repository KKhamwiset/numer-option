import { useState,useEffect } from "react";
import { evaluate,derivative } from 'mathjs';

const NewtonDivided = () => {
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