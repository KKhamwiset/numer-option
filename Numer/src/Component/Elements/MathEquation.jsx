import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css'; 

const MathEquation = ({ equation }) => {
  return (
    <span>
      <InlineMath>{equation}</InlineMath>
    </span>
  );
};

export default MathEquation;
