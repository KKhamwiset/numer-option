import { Link } from 'react-router-dom';

const Body = () => {    
    return (
        <div className='px-10'>
            <div className="text-center text-4xl mt-10">Numerical Method</div>
            <div className="text-left text-2xl mt-10 ">Root of Equations</div>
            <hr className='border-2 border-red-200'></hr>
            <div className="container mx-auto mt-10 flex flex-col justify-center md:flex-row lg:flex-row">
                <Link to="/Bisection" className="s:w-1/4 md:w-1/4 lg:w-1/4 s:h-1/4 md:h-1/3 lg:h-1/4 border border-slate-300 
                rounded-lg m-5">
                    <div className="text-center text-2xl mt-10 mb-10">Bisection Method</div>
                </Link>
                <div className="s:w-1/4 md:w-1/4 lg:w-1/4 s:h-1/4 md:h-1/3 lg:h-1/4 border border-slate-300 
                rounded-lg m-5">
                    <div className="text-center text-2xl  mt-10 mb-10">Graphical Method</div>
                </div>
            </div>
        </div>
    )

}
export default Body