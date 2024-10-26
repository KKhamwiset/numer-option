import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import NavBar from "./Component/NavBar";
import Home from "./Home";
import Bisection from "./Bisection";
import Graphical from "./Graphical";
import FalsePosition from "./FalsePosition";
import OnePointIteration from "./OnePoint-Iteration";
import NewtonRhapson from "./Newton-Rhapson";
import Cramer from "./Cramer";
import Secant from "./Secant";
import Gauss from "./Gauss";
import GaussJordan from "./GaussJordan";
import MatrixInversion from "./MatrixInversion";
import LU_Decomposition from "./LU-Decomposition";
import CholeskyDecomposition from "./Cholesky";
import JacobiMethod from "./Jacobi";
import GuassSeidel from "./GaussSeidel";
import ConjugateGradient from "./ConjugateGradient";

const App = () => {
  const rootEquationRoutes = [
    { path: "Bisection", element: <Bisection /> },
    { path: "Graphical", element: <Graphical /> },
    { path: "False-Position", element: <FalsePosition /> },
    { path: "One-Point_Iteration", element: <OnePointIteration /> },
    { path: "Newton-Rhapson", element: <NewtonRhapson /> },
    { path: "Secant-Method", element: <Secant /> }
  ];

  const linearAlgebraRoutes = [
    { path: "Cramer", element: <Cramer /> },
    { path: "Guass", element: <Gauss /> },
    { path: "GuassJordan", element: <GaussJordan /> },
    { path: "MatrixInversion", element: <MatrixInversion /> },
    { path: "LU-Decomposition", element: <LU_Decomposition  /> },
    { path: "Cholesky-Decomposition", element: <CholeskyDecomposition /> },
    { path: "Jacobi", element: <JacobiMethod /> },
    { path: "GaussSeidel", element: <GuassSeidel /> },
    { path: "ConjugateGradient", element: <ConjugateGradient /> }
  ];

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        {rootEquationRoutes.map(({ path, element }) => (
          <Route 
            key={path}
            path={`/Root_of_Equation/${path}`}
            element={element}
          />
        ))}
        {linearAlgebraRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={`/LinearAlgebra/${path}`}
            element={element}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default App;