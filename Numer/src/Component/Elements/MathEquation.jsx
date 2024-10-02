import React, { useEffect,useRef } from 'react';
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
    const mathJaxRef = useRef()
    useEffect(() => {
        if (mathJaxRef?.current) {
            mathJaxRef?.current?.typeset()
        }
    }, [equation])
  return (
    <MathJaxContext config={config} version={3}>
      <div>
        <MathJax inline>{equation}</MathJax>
      </div>
    </MathJaxContext>
  );
};

export default MathEquation;
