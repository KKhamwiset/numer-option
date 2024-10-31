import TableCell from "./Component/Elements/TableCell";
import axios from "axios";
import React, { useState, useEffect } from 'react';

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
    // const InputLabel = (subMethod) => {
    //     switch (subMethod) {
    //         case "graphical" : {
    //             return {
    //                 Xstart: "X Start",
    //                 Xend: "X End"
    //             }
    //         }
    //         case "bisection" : {
    //             return {
    //                 Xstart: "XL",
    //                 Xend: "XR"
    //             }
    //         }
    //     }
    // }
    const HistoryTable = () => (
        <div className="overflow-x-auto mb-20 w-1/2 mx-auto">
            <table className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
                <thead className="bg-slate-500">
                    <tr>
                        <TableCell additionalClasses="text-center text-white">Methods</TableCell>
                        <TableCell additionalClasses="text-center text-white">Input</TableCell>
                        <TableCell additionalClasses="text-center text-white">Equation</TableCell>
                        <TableCell additionalClasses="text-center text-white">Answer</TableCell>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 && data.map((item, index) => (
                        <tr key={index}>

                            <TableCell additionalClasses="text-center">
                                {item.dataSet.subtype}
                            </TableCell>
                            <TableCell additionalClasses="text-center">
                                {item.dataSet.Xstart},
                                {item.dataSet.Xend == '' ? item.dataSet.Xend : null}
                            </TableCell>
                            <TableCell additionalClasses="text-center">
                                {item.dataSet.equation}
                            </TableCell>
                            <TableCell additionalClasses="text-center">
                                {item.dataSet.answer}
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
