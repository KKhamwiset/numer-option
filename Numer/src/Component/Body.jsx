import Interpolation from "./Elements/Interpolation"
import LinearAlgebra from "./Elements/LinearAlgebra"
import RootOfEquation from "./Elements/RootOfEquation"
import Integration from "./Elements/Integration"
import Regression from "./Elements/Regression"

const Body = () => {    
    return (
        <>
          <div className="text-center text-4xl mt-20 font-bold">Numerical Method</div>
          <RootOfEquation/>
          <LinearAlgebra/>
          <Interpolation/>
          {/* <Regression/> */}
          <Integration/>
        </>
    )

}
export default Body