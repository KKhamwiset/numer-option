import Interpolation from "./Elements/Interpolation"
import LinearAlgebra from "./Elements/LinearAlgebra"
import RootOfEquation from "./Elements/RootOfEquation"
const Body = () => {    
    return (
        <>
          <div className="text-center text-4xl mt-20 font-bold">Numerical Method</div>
          <RootOfEquation/>
          <LinearAlgebra/>
          <Interpolation/>
        </>
    )

}
export default Body