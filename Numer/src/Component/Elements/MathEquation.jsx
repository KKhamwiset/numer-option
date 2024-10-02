import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css'; 

const MathEquation = ({ equation }) => {

  const formattedEquation = equation;
  return (
    <div>
      <InlineMath>{formattedEquation}</InlineMath>
    </div>
  );
};

export default MathEquation;
