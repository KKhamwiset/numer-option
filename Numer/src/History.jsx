import TableCell from "./Component/Elements/TableCell";
import axios from "axios";
import React, { useState, useEffect } from 'react';
import MathEquation from "./Component/Elements/MathEquation";
import 'katex/dist/katex.min.css';
const History = () => {
    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiURI = import.meta.env.VITE_API_URL;
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
            await axios.delete(`${apiURI}/api/rootofEQ/${id}`);
            setData(data.filter(item => item._id !== id));
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    }
    const formatMatrix = (matrix) => {
        console.log(matrix);
        return matrix.map(row => row.join(' & ')).join('\\\\');
    };
    const HistoryTable = () => (
        <div className="overflow-x-auto mb-20 w-1/2 mx-auto">
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
                                {item.dataSet.subtype == 'cramer' ? `\\begin{vmatrix}
                                ${formatMatrix(JSON.parse(item.dataSet.Xstart))}
                                \\end{vmatrix}` : 
                                item.dataSet.Xstart}
                                {item.dataSet.subtype == 'cramer' ? `\\begin{vmatrix}
                                ${formatMatrix(JSON.parse(item.dataSet.Xennd))}
                                \\end{vmatrix}` : 
                                ','+ item.dataSet.Xend}
                            </TableCell>
                            <TableCell additionalClasses="text-center">
                                <MathEquation equation={item.dataSet.equation} />
                            </TableCell>
                            <TableCell additionalClasses="text-center">
                                {item.dataSet.subtype == 'cramer' ? item.dataSet.answer : item.dataSet.answer.toFixed(4)}
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
