import React, { useEffect } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
const MathEquation = ({ equation }) => {
    const config = {
      loader: { load: ["[tex]/html"] },
      tex: {
        packages: { "[+]": ["html"] },
        inlineMath: [["$", "$"]],
        displayMath: [["\\(", "\\)"]]
      }
    }
  return (
    <MathJaxContext config={config} version={3}>
      <div>
        <MathJax inline>{equation}</MathJax>
      </div>
    </MathJaxContext>
  );
};

export default MathEquation;
