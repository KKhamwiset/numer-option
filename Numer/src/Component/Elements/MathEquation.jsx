import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const MathEquation = ({ equation }) => {
    const config = {
      loader: { load: ["input/tex", "output/chtml"] },
      tex: {
        inlineMath: [["$", "$"]],
        displayMath: [["$$", "$$"]]
      }
    };
    useEffect(() => {
      if (window.MathJax) {
          window.MathJax.typeset();
      }
  }, [equation]);
  return (
    <MathJaxContext config={config} version={3}>
      <div>
        <MathJax inline>{equation}</MathJax>
      </div>
    </MathJaxContext>
  );
};

export default MathEquation;
