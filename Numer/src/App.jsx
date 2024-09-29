import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Bisection from './Bisection';
import NavBar from './Component/NavBar';

const App = () => {
    return (
        <Router>
            <NavBar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/bisection" element={<Bisection />} />
            </Routes>
        </Router>
    );
};


export default App;
