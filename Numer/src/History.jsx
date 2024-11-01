import TableCell from "./Component/Elements/TableCell";
import axios from "axios";
import React, { useState, useEffect } from 'react';
import MathEquation from "./Component/Elements/MathEquation";

const History = () => { 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiURI = import.meta.env.VITE_API_URL;
    // const apiURI = "http://localhost:5000";
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiURI}/api/table`);
                console.log("Response data:", response.data); 
                setData(Array.isArray(response.data.data) ? response.data.data : []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]); 
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [])

    const handleDelete = async (id) =>  {
        try {
            await axios.delete(`${apiURI}/api/table/${id}`);
            setData(data.filter(item => item._id !== id));
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    }
    const formatMatrix = (matrix) => {
        return matrix.map(row => row.join(' & ')).join('\\\\');
    };
    const matrixDisplay = (matrix,text) => {

        let modified = `Matrix${text} = \\begin{bmatrix} + ${formatMatrix(matrix)} \\end{bmatrix}\\\\`
        modified = modified.replace(/\+/g, ' ');
        return (
            <MathEquation equation={modified} />
        )
    }
    const formatVector = (vector) => {
        return vector.map(row => Number(row).toFixed(4)).join(' \\\\ ');
    }
    const vectorDisplay = (vector) => {
        let modified = `X = \\\\\\begin{bmatrix} + ${formatVector(vector)} \\end{bmatrix}\\\\`;
        modified = modified.replace(/\+/g, ' ');
        return (
            <MathEquation equation={modified} />
        )
    }
    const HistoryTable = () => (
        <div className="overflow-x-auto mb-20 w-3/4 mx-auto">
            <table className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
                <thead className="bg-slate-500">
                    <tr>
                        <TableCell additionalClasses="text-center text-white">Methods</TableCell>
                        <TableCell additionalClasses="text-center text-white">Input</TableCell>
                        <TableCell additionalClasses="text-center text-white">Equation</TableCell>
                        <TableCell additionalClasses="text-center text-white">Answer</TableCell>
                        <TableCell additionalClasses="text-center text-white">Delete</TableCell>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 && data.map((item, index) => (
                        <tr key={index}>

                            <TableCell additionalClasses="text-center">
                                {item.dataSet.subtype}
                            </TableCell>
                            <TableCell additionalClasses="text-center">
                            {item.type === 'LinearAlgebra' ? (
                            <div className="flex gap-2 justify-center">
                                {matrixDisplay(JSON.parse(item.dataSet.matrixA),"A")}
                                {matrixDisplay(JSON.parse(item.dataSet.matrixB),"B")}
                            </div>
                                ) : (
                                    `${item.dataSet.Xstart} ${item.dataSet.Xend === '' ? 
                                    '' : ', ' + item.dataSet.Xend}`
                                )
                            }
                            </TableCell>
                            <TableCell additionalClasses="text-center">
                                <MathEquation equation={item.dataSet.equation ? item.dataSet.equation : 'None'} />
                            </TableCell>
                            <TableCell additionalClasses="text-center ">
                                {item.type == 'LinearAlgebra' ? 
                                    vectorDisplay(JSON.parse(item.dataSet.matrixX)) : 
                                    item.dataSet.answer.toFixed(4)
                                }
                            </TableCell>
                            <TableCell additionalClasses="text-center">
                                <button 
                                    className="text-red-500" 
                                    onClick={() => handleDelete(item._id)}
                                >
                                    Delete
                                </button>
                            </TableCell>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <>
            <div className="text-center text-3xl mt-10 mb-5">History</div>
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <HistoryTable />
            )}
        </>
    );
}

export default History;
