import { Link } from 'react-router-dom';

const Body = () => {    
    return (
        <div>
            <div className="text-center text-4xl mt-10">Numerical Method</div>
            <div className="container mx-auto mt-10 flex flex-col md:flex-row lg:flex-row">
                <Link to="/bisection" className="s:w-1/4 md:w-1/4 lg:w-1/4 s:h-1/4 md:h-1/3 lg:h-1/4 border border-slate-300 rounded-lg">
                    <div className="text-center text-2xl mt-10 mb-5">Bisection Method</div>
                </Link>
                
                <div className="s:w-1/4 md:w-1/4 lg:w-1/4 s:h-1/4 md:h-1/3 lg:h-1/4 border border-slate-300 rounded-lg">
                    <div className="text-center text-2xl mt-10 mb-5">Another Container</div>
                </div>
                </div>

        </div>
    )

}
export default Body