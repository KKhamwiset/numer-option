import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Bisection from './Bisection'
import Home from './Home'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/bisection" element={<Bisection />} />
      </Routes>
    </Router>
  );
}

export default App
