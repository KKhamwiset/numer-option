import React, { useEffect, useRef } from 'react'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

const config = {
    loader: { load: ['input/asciimath'] },
    asciimath: {
        displaystyle: true,
        delimiters: [
            ['$', '$'],
        ]
    }
}
const PreviewMaths = (props) => {
    const { sentence, show } = props
    const mathJaxRef = useRef()

    useEffect(() => {
        if (mathJaxRef?.current) {
            mathJaxRef?.current?.typeset()
        }
    }, [sentence])
   
    return (
        <>
            {!show && <center><h3>Preview</h3></center>}
            {sentence && <MathJaxContext config={config}>
                <pre style={{ marginBottom: 0, overflow: 'unset' }}>
                    <MathJax ref={mathJaxRef} style={{ whiteSpace: 'pre-wrap',overflowY: 'clip' }} inline dynamic>
                        {sentence || ' '}
                        </MathJax>
                    </pre>
                </MathJaxContext>}
        </>
    )
}

export default PreviewMaths
