import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css'; 

const MathEquation = ({ equation }) => {
  return (
    <div>
      <InlineMath>{equation}</InlineMath>
    </div>
  );
};

export default MathEquation;
