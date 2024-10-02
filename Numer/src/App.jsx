import './App.css';
import {Route, Routes, BrowserRouter } from 'react-router-dom';
import NavBar from './Component/NavBar';
import Home from './Home';
import Bisection from './Bisection';
import Graphical from './Graphical';
import FalsePosition from './FalsePosition';
import OnePointIteration from './OnePointIteration';

const App = () => {
    return (
        <BrowserRouter>
            <NavBar/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Home" element={<Home />} />
                    <Route path="/Root_of_Equation/Bisection" element={<Bisection />} />
                    <Route path="/Root_of_Equation/Graphical" element={<Graphical />} />
                    <Route path="/Root_of_Equation/False-Position" element={<FalsePosition />} />
                    <Route path="/Root_of_Equation/One-Point_Iteration" element={<OnePointIteration />} />
                </Routes>
        </BrowserRouter>
    );
};


export default App;
